export type EventCategory = 'academic' | 'holiday' | 'event' | 'placement' | 'deadline';

export interface ExtractedEventData {
  title: string;
  description: string;
  date: string; // Mandatory DD-MM-YYYY format
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  department: string;
  branch: string[];
  semester: number[];
  organizer: string;
  isImportant: boolean;
}

export interface ExtractEventRequest {
  pdfBase64?: string;
  mimeType?: string;
  fileName?: string;
  rawText?: string;
}

export interface ExtractEventResponse {
  success: boolean;
  message: string;
  event?: ExtractedEventData;
  error?: string;
}

