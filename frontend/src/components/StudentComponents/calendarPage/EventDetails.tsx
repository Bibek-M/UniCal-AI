import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { CalendarEvent } from "../../../types/calendar";
import { useSchedule } from "../../../hooks/useSchedule";

interface EventDetailsProps {
  event: CalendarEvent;
}

const categoryLabels: Record<string, string> = {
  academic: "Academic",
  holiday: "Holiday",
  event: "Event",
  placement: "Placement",
  deadline: "Deadline",
};

const categoryColors: Record<string, string> = {
  academic: "bg-red-100 text-red-700",
  holiday: "bg-green-100 text-green-700",
  event: "bg-purple-100 text-purple-700",
  placement: "bg-orange-100 text-orange-700",
  deadline: "bg-blue-100 text-blue-700",
};

const EventDetails = ({ event }: EventDetailsProps) => {
  const { isScheduled, addToSchedule, removeFromSchedule } = useSchedule();
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const eventIdentifier = event._id || event.id;
  const isInSchedule = isScheduled(eventIdentifier, event.title, event.date);

  const handleToggleSchedule = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      if (isInSchedule) {
        const res = await removeFromSchedule(eventIdentifier || "");
        setFeedback(res.message);
      } else {
        const res = await addToSchedule(event);
        setFeedback(res.message);
      }
    } catch (err: any) {
      setFeedback(err.message || "Failed to update schedule");
    } finally {
      setActionLoading(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleAddToGoogleCalendar = () => {
    let dateStr = "";
    if (event.date) {
      if (event.date.includes("-")) {
        const parts = event.date.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 2 && parts[2].length === 4) {
            // DD-MM-YYYY -> YYYYMMDD
            dateStr = `${parts[2]}${parts[1]}${parts[0]}`;
          } else if (parts[0].length === 4) {
            // YYYY-MM-DD -> YYYYMMDD
            dateStr = `${parts[0]}${parts[1]}${parts[2]}`;
          }
        }
      }
    }

    if (!dateStr) {
      const now = new Date();
      dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    }

    const startDateTime = `${dateStr}`;
    const endDateTime = `${dateStr}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title || "University Event",
      dates: `${startDateTime}/${endDateTime}`,
      details: `${event.description || ""}\n\nCategory: ${event.category || ""}\nLocation: ${event.location || "Campus"}`,
      location: event.location || "Campus",
    });

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-start gap-4">
        {/* Category indicator */}
        <div
          className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ${
            event.category === "academic"
              ? "bg-red-500"
              : event.category === "holiday"
              ? "bg-green-500"
              : event.category === "event"
              ? "bg-purple-500"
              : event.category === "placement"
              ? "bg-orange-500"
              : "bg-blue-500"
          }`}
        />

        <div className="min-w-0 flex-1">
          {/* Title & Important badge */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>

            {event.isImportant && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                Important
              </span>
            )}
          </div>

          {/* Category Pill */}
          <span
            className={`mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
              categoryColors[event.category] || "bg-slate-100 text-slate-700"
            }`}
          >
            {categoryLabels[event.category] || event.category}
          </span>

          {/* Description */}
          <p className="mt-3.5 text-sm leading-6 text-slate-600">
            {event.description}
          </p>

          {/* Information Rows */}
          <div className="mt-4 space-y-2 text-sm">
            {event.date && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">📅</span>
                <span className="font-medium">{event.date}</span>
              </div>
            )}

            {event.startTime && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">🕐</span>
                <span>
                  {event.startTime}
                  {event.endTime && ` – ${event.endTime}`}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">📍</span>
                <span>{event.location}</span>
              </div>
            )}

            {event.organizer && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">🏛️</span>
                <span>{event.organizer}</span>
              </div>
            )}

            {event.department && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">🎓</span>
                <span>{event.department}</span>
              </div>
            )}

            {event.branch && event.branch.length > 0 && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">👥</span>
                <span>{event.branch.join(", ")}</span>
              </div>
            )}

            {event.semester && event.semester.length > 0 && (
              <div className="flex items-center gap-3 text-slate-700">
                <span className="text-slate-400">📚</span>
                <span>Semester {event.semester.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Action Feedback Toast */}
          {feedback && (
            <div className="mt-4 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 flex items-center justify-between animate-fadeIn">
              <span>{feedback}</span>
              {isInSchedule && (
                <Link
                  to="/mySchedule"
                  className="ml-2 text-blue-600 underline hover:text-blue-800 flex items-center gap-1"
                >
                  View My Schedule <ExternalLink size={12} />
                </Link>
              )}
            </div>
          )}

          {/* Action Buttons: Add to Google & Add to Schedule */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Google Calendar Button */}
            <button
              type="button"
              onClick={handleAddToGoogleCalendar}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3.5 py-2.5 text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98]"
              title="Export event to Google Calendar"
            >
              <CalendarPlus size={16} className="text-blue-600" />
              <span>+ Add to Google Calendar</span>
            </button>

            {/* My Schedule Button */}
            <button
              type="button"
              onClick={handleToggleSchedule}
              disabled={actionLoading}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition cursor-pointer shadow-xs active:scale-[0.98] ${
                isInSchedule
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {actionLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : isInSchedule ? (
                <>
                  <BookmarkCheck size={16} />
                  <span>In Your Schedule</span>
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  <span>+ Add to Schedule</span>
                </>
              )}
            </button>

            {/* Quick Remove option if already in schedule */}
            {isInSchedule && !actionLoading && (
              <button
                type="button"
                onClick={handleToggleSchedule}
                className="text-xs text-rose-600 hover:text-rose-800 underline flex items-center gap-1 cursor-pointer ml-auto"
                title="Remove this event from your personal schedule"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
