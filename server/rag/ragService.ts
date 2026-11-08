import { userModel, eventModel, faqModel, scheduleModel } from '../models.ts';
import { generateGroqChatCompletion } from './groqClient.ts';
import type { ChatMessage, EventSourceCitation, RagChatResponse } from './types.ts';

/**
 * Parses DD-MM-YYYY date into a JavaScript Date object
 */
function parseDDMMYYYY(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Formats a Date object to DD-MM-YYYY
 */
function formatDDMMYYYY(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function processRagChat(
  userId: string,
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<RagChatResponse> {
  const trimmedMessage = userMessage.trim();
  if (!trimmedMessage) {
    throw new Error('Message content cannot be empty.');
  }

  // 1. Fetch Student Profile
  const student = await userModel.findById(userId).select('-password');
  const studentName = student?.name || 'Student';
  const studentBranch = (student?.department || 'CSE').trim();
  const rawSem = student?.semester ? String(student.semester).trim() : '1';
  const studentSemNum = parseInt(rawSem.replace(/\D/g, ''), 10) || 1;
  const studentRollNo = student?.rollNumber || 'Not Assigned';

  // 2. Date Anchoring
  const now = new Date();
  const todayStr = formatDDMMYYYY(now);
  const todayFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 3. Database Retrieval - Events & Notices
  const allEvents = await eventModel.find({}).sort({ date: 1 }).lean();

  // Separate into upcoming and all
  const upcomingEvents: any[] = [];
  const pastEvents: any[] = [];

  for (const ev of allEvents) {
    const evDate = parseDDMMYYYY(ev.date);
    if (evDate && evDate >= todayStart) {
      upcomingEvents.push(ev);
    } else {
      pastEvents.push(ev);
    }
  }

  // Filter events relevant to this student's branch & semester or university-wide
  const isRelevantForStudent = (ev: any) => {
    // If event has no branch restrictions, it's university-wide
    const branchMatch =
      !ev.branch ||
      ev.branch.length === 0 ||
      ev.branch.some(
        (b: string) =>
          b.toLowerCase() === studentBranch.toLowerCase() ||
          b.toLowerCase().includes(studentBranch.toLowerCase()) ||
          studentBranch.toLowerCase().includes(b.toLowerCase())
      ) ||
      (ev.department &&
        ev.department.toLowerCase().includes(studentBranch.toLowerCase()));

    // If event has semester restrictions, check if student's sem is included
    const semMatch =
      !ev.semester ||
      ev.semester.length === 0 ||
      ev.semester.includes(studentSemNum);

    return branchMatch && semMatch;
  };

  // Find candidate matches for citations and direct context
  const relevantUpcoming = upcomingEvents.filter(isRelevantForStudent);
  const relevantPast = pastEvents.filter(isRelevantForStudent);

  // 4. Retrieve Student's Personal Schedule
  const studentSchedules = await scheduleModel.find({ userId }).lean();

  // 5. Retrieve FAQs for policy / general knowledge
  const faqs = await faqModel.find({}).limit(15).lean();

  // 6. Build Context String for System Prompt
  const eventsContext = upcomingEvents.map((ev: any, idx: number) => {
    const branchTag = ev.branch && ev.branch.length > 0 ? ev.branch.join(', ') : 'All Branches';
    const semTag = ev.semester && ev.semester.length > 0 ? ev.semester.map((s: any) => `Sem ${s}`).join(', ') : 'All Semesters';
    const deptTag = ev.department ? `Department: ${ev.department}` : '';
    const locTag = ev.location ? `Venue: ${ev.location}` : '';
    const timeTag = ev.startTime ? `Time: ${ev.startTime}${ev.endTime ? ` - ${ev.endTime}` : ''}` : '';

    return `[Event #${idx + 1}]
Title: ${ev.title}
Date: ${ev.date}
Category: ${ev.category || 'general'}
Target Branches: ${branchTag}
Target Semesters: ${semTag}
${deptTag}
${timeTag}
${locTag}
Description: ${ev.description || 'No description provided.'}
Important: ${ev.isImportant ? 'Yes' : 'No'}`;
  }).join('\n\n');

  const scheduleContext = studentSchedules.map((sc: any, idx: number) => {
    return `- [Schedule Item #${idx + 1}] "${sc.event?.title || 'Untitled'}" on ${sc.event?.date || 'N/A'}${sc.notes ? ` (Note: ${sc.notes})` : ''}`;
  }).join('\n');

  const faqsContext = faqs.map((f: any, idx: number) => {
    return `Q${idx + 1}: ${f.question}\nA: ${f.answer}`;
  }).join('\n\n');

  // 7. System Prompt Assembly
  const systemPrompt = `You are the official Unical AI Student Companion and Academic Assistant.
Your mission is to provide accurate, concise, and helpful answers to students based on verified university records.

=== CURRENT STUDENT PROFILE ===
Name: ${studentName}
Enrolled Department/Branch: ${studentBranch}
Current Semester: ${studentSemNum}th Semester
Roll Number: ${studentRollNo}

=== TEMPORAL GROUNDING ===
Today's Date: ${todayFormatted} (${todayStr})

=== VERIFIED UNIVERSITY EVENTS & NOTICES DATABASE ===
${eventsContext || 'No upcoming university events currently logged in the system.'}

=== STUDENT'S PERSONAL SAVED SCHEDULE ===
${scheduleContext || 'Student has not added any events to their personal schedule yet.'}

=== UNIVERSITY HELP & FAQS ===
${faqsContext || 'No university FAQs found.'}

=== STRICT GUIDELINES FOR ANSWERING ===
1. TEMPORAL ACCURACY: Always use today's date (${todayFormatted}, ${todayStr}) as the reference point.
   - When asked "When is my next exam?" or "next review/viva", look for events with category "academic", "exam", or titles containing "Exam", "Review", "Viva", "Test" on or after today's date that apply to ${studentBranch} Sem ${studentSemNum} or All Branches.
   - If an exam has already passed (before ${todayStr}), clarify that it has passed.
2. BRANCH & SEMESTER SPECIFICITY: Prioritize events matching the student's branch (${studentBranch}) and semester (${studentSemNum}).
3. NO HALLUCINATION: Only state facts, dates, venues, and timings that are explicitly present in the database above. If no upcoming exam or event is scheduled, explicitly tell the student:
   "No upcoming exams for ${studentBranch} Sem ${studentSemNum} are currently scheduled in the portal after ${todayStr}. Please check back later or consult the academic administration."
4. FORMATTING: Be concise, clear, and friendly. Use bolding for dates, exam names, and venues. When applicable, advise the student to add the event to their schedule.`;

  // 8. Assemble Message Chain (System Prompt + Recent History + User Message)
  const messagesToSend: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
  ];

  // Include recent conversation history (up to last 6 turns)
  if (Array.isArray(chatHistory) && chatHistory.length > 0) {
    const validHistory = chatHistory
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
      .slice(-6);
    messagesToSend.push(...validHistory);
  }

  // Append user message
  messagesToSend.push({
    role: 'user',
    content: trimmedMessage,
  });

  // 9. Dispatch to Groq API
  console.log(`[RAG Service] Processing query for student "${studentName}" (${studentBranch} Sem ${studentSemNum}): "${trimmedMessage}"`);
  const completion = await generateGroqChatCompletion(messagesToSend, {
    temperature: 0.2, // Low temperature for high factual precision
  });

  // 10. Extract relevant source event citations
  const lowerReply = completion.reply.toLowerCase();
  const lowerQuery = trimmedMessage.toLowerCase();

  const citedEvents: EventSourceCitation[] = [];
  for (const ev of allEvents) {
    const titleMatch = lowerReply.includes(ev.title.toLowerCase()) || lowerQuery.includes(ev.title.toLowerCase());
    const dateMatch = ev.date && lowerReply.includes(ev.date);

    if (titleMatch || dateMatch) {
      citedEvents.push({
        id: ev.id || ev._id,
        title: ev.title,
        date: ev.date,
        startTime: ev.startTime,
        endTime: ev.endTime,
        location: ev.location,
        category: ev.category,
        department: ev.department,
        branch: ev.branch,
        semester: ev.semester,
        isImportant: ev.isImportant,
      });
    }
  }

  // If no direct citation found but user asked for next exam, attach top relevant upcoming exam
  if (citedEvents.length === 0 && (lowerQuery.includes('exam') || lowerQuery.includes('schedule') || lowerQuery.includes('next'))) {
    const topUpcoming = relevantUpcoming.slice(0, 2);
    for (const ev of topUpcoming) {
      citedEvents.push({
        id: ev.id || ev._id,
        title: ev.title,
        date: ev.date,
        startTime: ev.startTime,
        endTime: ev.endTime,
        location: ev.location,
        category: ev.category,
        department: ev.department,
        branch: ev.branch,
        semester: ev.semester,
        isImportant: ev.isImportant,
      });
    }
  }

  return {
    success: true,
    reply: completion.reply,
    sources: citedEvents.slice(0, 3),
    modelUsed: completion.modelUsed,
    timestamp: new Date().toISOString(),
  };
}

