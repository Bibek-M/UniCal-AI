import type { CalendarEvent } from "../types/calendar";

export const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Mid Semester Examination",
    description:
      "Mid semester examinations for 7th semester students. Students are required to carry their university ID card and examination admit card.",
    date: "2026-09-10",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    location: "University Examination Hall",
    category: "academic",
    department: "Computer Science",
    branch: ["CSE", "IT"],
    semester: [7],
    organizer: "Examination Cell",
    isImportant: true,
  },

  {
    id: 2,
    title: "Hackathon 2026",
    description:
      "A 24-hour university-level hackathon where students can build innovative solutions across AI, Web3, FinTech and other technology domains.",
    date: "2026-09-12",
    startTime: "10:00 AM",
    endTime: "10:00 AM",
    location: "Main Auditorium",
    category: "event",
    department: "Computer Science",
    branch: ["CSE", "IT", "ECE", "EEE"],
    semester: [5, 6, 7, 8],
    organizer: "Innovation Cell",
    isImportant: true,
  },

  {
    id: 3,
    title: "Project Submission Deadline",
    description:
      "Final submission deadline for the 7th semester mini project proposal.",
    date: "2026-09-15",
    startTime: "11:59 PM",
    category: "deadline",
    department: "Computer Science",
    branch: ["CSE", "IT"],
    semester: [7],
    organizer: "Department of CSE",
    isImportant: true,
  },

  {
    id: 4,
    title: "Industry Visit",
    description:
      "Students will visit ABC Technologies as part of the industrial exposure program.",
    date: "2026-09-18",
    startTime: "9:00 AM",
    endTime: "4:00 PM",
    location: "ABC Technologies Campus",
    category: "event",
    department: "Computer Science",
    branch: ["CSE", "IT"],
    semester: [7],
    organizer: "Training & Placement Cell",
  },

  {
    id: 5,
    title: "Gandhi Jayanti",
    description: "University holiday on the occasion of Gandhi Jayanti.",
    date: "2026-09-22",
    category: "holiday",
    organizer: "University Administration",
    isImportant: true,
  },

  {
    id: 6,
    title: "Placement Drive - TechCorp",
    description:
      "Campus recruitment drive for eligible final-year students. The process includes an online assessment followed by technical and HR interviews.",
    date: "2026-09-25",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    location: "Placement Cell",
    category: "placement",
    department: "Training & Placement",
    branch: ["CSE", "IT", "ECE"],
    semester: [7, 8],
    organizer: "Training & Placement Cell",
    isImportant: true,
  },

  {
    id: 7,
    title: "Database Systems Workshop",
    description:
      "Hands-on workshop covering PostgreSQL, database design, indexing and query optimization.",
    date: "2026-09-05",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    location: "Lab 3",
    category: "event",
    department: "Computer Science",
    branch: ["CSE", "IT"],
    semester: [5, 7],
    organizer: "Department of CSE",
  },

  {
    id: 8,
    title: "Course Registration Deadline",
    description:
      "Last date for students to complete their semester course registration.",
    date: "2026-09-07",
    startTime: "11:59 PM",
    category: "deadline",
    organizer: "Academic Section",
    isImportant: true,
  },

  {
    id: 9,
    title: "Technical Seminar",
    description:
      "Technical seminar on Generative AI and the future of software engineering.",
    date: "2026-09-03",
    startTime: "11:00 AM",
    endTime: "1:00 PM",
    location: "Seminar Hall",
    category: "event",
    department: "Computer Science",
    branch: ["CSE", "IT"],
    semester: [5, 6, 7, 8],
    organizer: "CSE Department",
  },

  {
    id: 10,
    title: "End Semester Examination Registration",
    description:
      "Registration portal opens for the upcoming end semester examinations.",
    date: "2026-09-28",
    startTime: "10:00 AM",
    category: "academic",
    organizer: "Examination Cell",
  },

  {
    id: 11,
    title: "Faculty Development Program",
    description:
      "Five-day faculty development program on emerging technologies and AI-assisted education.",
    date: "2026-09-29",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    location: "Conference Hall",
    category: "event",
    organizer: "University Administration",
  },

  {
    id: 12,
    title: "Scholarship Application Deadline",
    description:
      "Last date for submitting applications for the university merit scholarship.",
    date: "2026-09-30",
    startTime: "11:59 PM",
    category: "deadline",
    organizer: "Student Welfare Department",
    isImportant: true,
  },

  // October events

  {
    id: 13,
    title: "Gandhi Jayanti",
    description: "University holiday on the occasion of Gandhi Jayanti.",
    date: "2026-10-02",
    category: "holiday",
    organizer: "University Administration",
    isImportant: true,
  },

  {
    id: 14,
    title: "Career Fair 2026",
    description:
      "Annual career fair featuring companies from software, consulting and technology sectors.",
    date: "2026-10-08",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    location: "University Ground",
    category: "placement",
    organizer: "Training & Placement Cell",
    isImportant: true,
  },

  {
    id: 15,
    title: "End Semester Examination",
    description:
      "End semester examinations begin for eligible undergraduate students.",
    date: "2026-10-15",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    location: "University Examination Hall",
    category: "academic",
    branch: ["CSE", "IT", "ECE", "EEE"],
    semester: [7, 8],
    organizer: "Examination Cell",
    isImportant: true,
  },
  {
    id: 16,
    title: "Come to die",
    description:
      "End semester examinations begin for eligible undergraduate students.",
    date: "2026-09-10",
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    location: "Free Fire Magona Nia",
    category: "academic",
    branch: ["CSE", "IT", "ECE", "EEE"],
    semester: [7, 8],
    organizer: "Examination Cell",
    isImportant: true,
  },
];
