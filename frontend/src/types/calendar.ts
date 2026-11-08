export type EventCategory =
  | "academic"
  | "holiday"
  | "event"
  | "placement"
  | "deadline";

export interface CalendarEvent {
  _id?: string;
  id?: number | string;

  title: string;
  description: string;

  date: string;

  startTime?: string;
  endTime?: string;

  location?: string;

  category: EventCategory;

  department?: string;
  branch?: string[];
  semester?: number[];

  organizer?: string;

  isImportant?: boolean;
}

export interface StudentScheduleItem {
  _id: string;
  userId: string;
  eventId?: string;
  eventCustomId?: number;
  event: CalendarEvent;
  notes?: string;
  addedAt: string;
}
