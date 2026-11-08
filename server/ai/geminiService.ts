import type { ExtractedEventData, EventCategory } from './types.ts';

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Normalizes any date string into strict DD-MM-YYYY format
 */
export function normalizeDateToDDMMYYYY(inputDate: string | undefined): string {
  if (!inputDate || typeof inputDate !== 'string') {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const trimmed = inputDate.trim();

  // Already DD-MM-YYYY
  const ddMmYyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (ddMmYyyyRegex.test(trimmed)) {
    return trimmed;
  }

  // DD/MM/YYYY
  const ddSlashMmRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const slashMatch = trimmed.match(ddSlashMmRegex);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0');
    const month = slashMatch[2].padStart(2, '0');
    const year = slashMatch[3];
    return `${day}-${month}-${year}`;
  }

  // YYYY-MM-DD
  const yyyyMmDdRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const yyyyMatch = trimmed.match(yyyyMmDdRegex);
  if (yyyyMatch) {
    const year = yyyyMatch[1];
    const month = yyyyMatch[2].padStart(2, '0');
    const day = yyyyMatch[3].padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  // Fallback to JS Date parsing
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Default to today if unparseable
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Normalizes category into strict allowed enum values
 */
export function normalizeCategory(category: any): EventCategory {
  if (!category || typeof category !== 'string') return 'event';
  const lower = category.toLowerCase().trim();

  if (['academic', 'holiday', 'event', 'placement', 'deadline'].includes(lower)) {
    return lower as EventCategory;
  }

  if (lower.includes('exam') || lower.includes('test') || lower.includes('class') || lower.includes('academic') || lower.includes('admission') || lower.includes('lecture')) {
    return 'academic';
  }
  if (lower.includes('holiday') || lower.includes('vacation') || lower.includes('break') || lower.includes('leave')) {
    return 'holiday';
  }
  if (lower.includes('placement') || lower.includes('interview') || lower.includes('job') || lower.includes('internship') || lower.includes('drive')) {
    return 'placement';
  }
  if (lower.includes('deadline') || lower.includes('due') || lower.includes('submission') || lower.includes('last date')) {
    return 'deadline';
  }

  return 'event';
}

/**
 * Normalizes raw extracted data from Gemini JSON into strictly validated ExtractedEventData
 */
export function normalizeExtractedEvent(raw: any): ExtractedEventData {
  const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : 'University Notice';
  const description = typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim() : title;
  const date = normalizeDateToDDMMYYYY(raw.date);
  const startTime = typeof raw.startTime === 'string' ? raw.startTime.trim() : '';
  const endTime = typeof raw.endTime === 'string' ? raw.endTime.trim() : '';
  const location = typeof raw.location === 'string' ? raw.location.trim() : 'Campus';
  const category = normalizeCategory(raw.category);
  const department = typeof raw.department === 'string' ? raw.department.trim() : '';
  const organizer = typeof raw.organizer === 'string' ? raw.organizer.trim() : '';
  const isImportant = Boolean(raw.isImportant);

  let branch: string[] = [];
  if (Array.isArray(raw.branch)) {
    branch = raw.branch.map((b: any) => String(b).trim()).filter(Boolean);
  } else if (typeof raw.branch === 'string' && raw.branch.trim()) {
    branch = raw.branch.split(/[,/]+/).map((s: string) => s.trim()).filter(Boolean);
  }

  let semester: number[] = [];
  if (Array.isArray(raw.semester)) {
    semester = raw.semester
      .map((s: any) => {
        const num = parseInt(String(s).replace(/\D/g, ''), 10);
        return isNaN(num) ? null : num;
      })
      .filter((s: number | null): s is number => s !== null && s >= 1 && s <= 8);
  } else if (typeof raw.semester === 'number') {
    if (raw.semester >= 1 && raw.semester <= 8) semester = [raw.semester];
  } else if (typeof raw.semester === 'string' && raw.semester.trim()) {
    const matches = raw.semester.match(/\d+/g);
    if (matches) {
      semester = matches
        .map((m: string) => parseInt(m, 10))
        .filter((n: number) => n >= 1 && n <= 8);
    }
  }

  return {
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    category,
    department,
    branch,
    semester,
    organizer,
    isImportant,
  };
}

const SYSTEM_EXTRACTION_PROMPT = `You are an AI assistant specialized in analyzing university circulars, notices, exam schedules, academic notifications, and event flyers.

Carefully read the provided document and extract structured event details according to this exact JSON schema:
{
  "title": "Clear, concise event or notice title",
  "description": "Comprehensive explanation of what the event, circular, or exam is about",
  "date": "Event start date formatted STRICTLY as DD-MM-YYYY (e.g., 15-09-2026). This format is required.",
  "startTime": "Start time e.g. '09:30 AM' or '10:00 AM' (leave empty '' if unspecified)",
  "endTime": "End time e.g. '04:30 PM' or '05:00 PM' (leave empty '' if unspecified)",
  "location": "Physical venue, hall, room, or 'Campus' or 'Online'",
  "category": "One of: 'academic', 'holiday', 'event', 'placement', 'deadline'",
  "department": "Associated department or 'All Departments'",
  "branch": ["Array of engineering/degree branches if specified, e.g. ['CSE', 'ECE'] or empty [] if campus-wide"],
  "semester": [1, 2, 3, 4, 5, 6, 7, 8] // Array of applicable semester numbers, or empty [] if all
  "organizer": "Issuing authority, dean, department head, or student club",
  "isImportant": true or false // True if urgent, mandatory, exam, or deadline
}

CRITICAL RULES:
1. "date" MUST strictly use DD-MM-YYYY format (two-digit day, two-digit month, four-digit year).
2. "category" MUST be one of: academic, holiday, event, placement, deadline.
3. If multiple dates appear (e.g. a festival or exam week), use the first/commencing date for "date", and mention the full duration in "description".
4. Return ONLY the valid JSON object. Do not enclose in markdown blocks like \`\`\`json.`;

// Exclude non-document, audio-only, specialized or retired models
const EXCLUDED_KEYWORDS = [
  'tts',
  'transcribe',
  'lyria',
  'clip',
  'banana',
  'robotics',
  'customtools',
  'computer-use',
  'gemini-2.5-flash', // Retired for new users
  'gemini-2.0-flash', // Retired
  'gemini-1.5-flash', // Retired
];

// Production verified models for multimodal document/PDF analysis in priority order
const TOP_VERIFIED_MODELS = [
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-lite-latest',
  'gemini-pro-latest',
  'gemini-3-flash-preview',
];

let cachedModelsList: string[] | null = null;

/**
 * Discovers and prioritizes models supported by this Google Gemini API key
 */
export async function getModelsToTry(apiKey: string): Promise<string[]> {
  const models: string[] = [];

  // 1. Env override if defined
  if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim()) {
    const envModel = process.env.GEMINI_MODEL.trim().replace(/^models\//, '');
    models.push(envModel);
  }

  // 2. High-reliability multimodal models first
  for (const m of TOP_VERIFIED_MODELS) {
    if (!models.includes(m)) {
      models.push(m);
    }
  }

  // 3. Dynamically discover models supported by this key
  if (!cachedModelsList) {
    try {
      const listUrl = `${GEMINI_API_BASE_URL}?key=${apiKey}`;
      const listRes = await fetch(listUrl);
      if (listRes.ok) {
        const data: any = await listRes.json();
        const apiModels: any[] = data.models || [];
        const supported = apiModels
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace(/^models\//, ''))
          .filter((name: string) => {
            const lower = name.toLowerCase();
            return !EXCLUDED_KEYWORDS.some((kw) => lower.includes(kw));
          });

        if (supported.length > 0) {
          cachedModelsList = supported;
        }
      }
    } catch (err: any) {
      console.warn('[AI Extractor] Dynamic model lookup failed, using verified fallback list:', err.message);
    }
  }

  if (cachedModelsList && cachedModelsList.length > 0) {
    for (const m of cachedModelsList) {
      if (!models.includes(m)) {
        models.push(m);
      }
    }
  }

  return models;
}

/**
 * Calls Google Gemini REST API to extract event details from base64 PDF or image
 */
export async function extractEventFromDocument(
  base64Data: string,
  mimeType: string = 'application/pdf',
  apiKeyOverride?: string
): Promise<ExtractedEventData> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  // Strip any data URI prefix if present (e.g. data:application/pdf;base64,)
  let cleanBase64 = base64Data;
  if (cleanBase64.includes(';base64,')) {
    cleanBase64 = cleanBase64.split(';base64,')[1];
  }
  cleanBase64 = cleanBase64.replace(/\s/g, '');

  const modelsToTry = await getModelsToTry(apiKey);
  console.log(`[AI Extractor] Attempting extraction with priority models: ${modelsToTry.slice(0, 5).join(', ')}`);

  let lastError: any = null;

  for (const model of modelsToTry) {
    const cleanModel = model.replace(/^models\//, '');
    try {
      console.log(`[AI Extractor] Querying model "${cleanModel}"...`);
      const url = `${GEMINI_API_BASE_URL}/${cleanModel}:generateContent?key=${apiKey}`;

      const requestPayload = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: SYSTEM_EXTRACTION_PROMPT,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: 'application/json',
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[AI Extractor] Model "${cleanModel}" failed (${response.status}). Trying next model...`);
        lastError = new Error(`Gemini API error (${response.status}): ${errorText}`);
        continue; // Try fallback model
      }

      const jsonResponse: any = await response.json();
      const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        console.warn(`[AI Extractor] Model "${cleanModel}" returned empty text. Trying next model...`);
        continue;
      }

      console.log(`[AI Extractor] Successfully extracted event data using "${cleanModel}"!`);

      // Parse JSON from output
      let parsedData: any;
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        // Strip possible markdown ticks
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      return normalizeExtractedEvent(parsedData);
    } catch (err: any) {
      console.warn(`[AI Extractor] Attempt with model "${cleanModel}" failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to extract event data using Gemini API');
}

/**
 * Extracts event details from plain text (e.g. copied circular text)
 */
export async function extractEventFromText(
  textContent: string,
  apiKeyOverride?: string
): Promise<ExtractedEventData> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  const modelsToTry = await getModelsToTry(apiKey);
  let lastError: any = null;

  for (const model of modelsToTry) {
    const cleanModel = model.replace(/^models\//, '');
    try {
      console.log(`[AI Extractor] Querying text model "${cleanModel}"...`);
      const url = `${GEMINI_API_BASE_URL}/${cleanModel}:generateContent?key=${apiKey}`;

      const requestPayload = {
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_EXTRACTION_PROMPT}\n\nDOCUMENT TEXT TO ANALYZE:\n${textContent}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: 'application/json',
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[AI Extractor] Model "${cleanModel}" failed (${response.status}). Trying next model...`);
        lastError = new Error(`Gemini API error (${response.status}): ${errorText}`);
        continue;
      }

      const jsonResponse: any = await response.json();
      const rawText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        continue;
      }

      console.log(`[AI Extractor] Successfully extracted text data using "${cleanModel}"!`);

      let parsedData: any;
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      return normalizeExtractedEvent(parsedData);
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to extract event data from text using Gemini API');
}
