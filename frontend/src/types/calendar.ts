export type EventCategory =
  | "academic"
  | "holiday"
  | "event"
  | "placement"
  | "deadline";

export interface CalendarEvent {
  id: number;

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
