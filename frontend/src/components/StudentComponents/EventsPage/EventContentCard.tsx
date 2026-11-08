import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Building2,
  CalendarPlus,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { CalendarEvent, EventCategory } from "../../../types/calendar";
import { useSchedule } from "../../../hooks/useSchedule";

interface EventContentCardProps {
  event: CalendarEvent;
  onToast?: (msg: { type: "success" | "error"; text: string }) => void;
}

const CATEGORY_META: Record<
  EventCategory,
  { label: string; badge: string; dot: string; border: string }
> = {
  academic: {
    label: "Academic",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    border: "border-l-red-500",
  },
  holiday: {
    label: "Holiday",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    border: "border-l-emerald-500",
  },
  event: {
    label: "Campus Event",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    border: "border-l-purple-500",
  },
  placement: {
    label: "Placement Drive",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    border: "border-l-orange-500",
  },
  deadline: {
    label: "Submission Deadline",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    border: "border-l-blue-500",
  },
};

// Date helper to parse DD-MM-YYYY or YYYY-MM-DD
function parseEventDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (trimmed.includes("-")) {
    const parts = trimmed.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 2 && parts[2].length === 4) {
        // DD-MM-YYYY
        const [day, month, year] = parts;
        return new Date(Number(year), Number(month) - 1, Number(day));
      } else if (parts[0].length === 4) {
        // YYYY-MM-DD
        const [year, month, day] = parts;
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
    }
  }
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

function getCountdownInfo(dateStr?: string): { label: string; isPast: boolean; formatted: string } {
  const eventDate = parseEventDate(dateStr);
  if (!eventDate) return { label: dateStr || "", isPast: false, formatted: dateStr || "" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const formatted = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (diffDays === 0) return { label: "Today", isPast: false, formatted };
  if (diffDays === 1) return { label: "Tomorrow", isPast: false, formatted };
  if (diffDays > 1 && diffDays <= 7) return { label: `In ${diffDays} days`, isPast: false, formatted };
  if (diffDays > 7) return { label: `In ${diffDays} days`, isPast: false, formatted };
  if (diffDays === -1) return { label: "Yesterday", isPast: true, formatted };
  return { label: `${Math.abs(diffDays)} days ago`, isPast: true, formatted };
}

const EventContentCard: React.FC<EventContentCardProps> = ({ event, onToast }) => {
  const { isScheduled, addToSchedule, removeFromSchedule } = useSchedule();
  const [scheduling, setScheduling] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const eventIdentifier = event._id || event.id;
  const isInSchedule = isScheduled(eventIdentifier, event.title, event.date);
  const meta = CATEGORY_META[event.category] || CATEGORY_META.event;
  const countdown = getCountdownInfo(event.date);

  const handleToggleSchedule = async () => {
    setScheduling(true);
    try {
      if (isInSchedule) {
        const res = await removeFromSchedule(eventIdentifier || "");
        if (onToast) onToast({ type: "success", text: res.message });
      } else {
        const res = await addToSchedule(event);
        if (onToast) onToast({ type: "success", text: res.message });
      }
    } catch (err: any) {
      if (onToast) onToast({ type: "error", text: err.message || "Failed to update schedule" });
    } finally {
      setScheduling(false);
    }
  };

  const handleGoogleCalendarExport = () => {
    let dateStr = "";
    if (event.date) {
      if (event.date.includes("-")) {
        const parts = event.date.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 2 && parts[2].length === 4) {
            dateStr = `${parts[2]}${parts[1]}${parts[0]}`;
          } else if (parts[0].length === 4) {
            dateStr = `${parts[0]}${parts[1]}${parts[2]}`;
          }
        }
      }
    }

    if (!dateStr) {
      const now = new Date();
      dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    }

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title || "University Notice",
      dates: `${dateStr}/${dateStr}`,
      details: `${event.description || ""}\n\nVenue: ${event.location || "Campus"}\nCategory: ${event.category || ""}`,
      location: event.location || "Campus",
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    const textToCopy = `📌 ${event.title}\n📅 Date: ${event.date} ${event.startTime ? `(${event.startTime})` : ""}\n📍 Venue: ${event.location || "Campus"}\n\n${event.description || ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onToast) onToast({ type: "success", text: "Notice details copied to clipboard!" });
    setTimeout(() => setCopied(false), 2500);
  };

  const isLongDescription = event.description && event.description.length > 220;

  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all border-l-4 ${meta.border} flex flex-col justify-between relative`}>
      <div>
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Pill */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${meta.badge}`}>
              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>

            {/* Important / Urgent Badge */}
            {event.isImportant && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
                ⚡ Important
              </span>
            )}
          </div>

          {/* Countdown & Date Tag */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                countdown.isPast
                  ? "bg-slate-100 text-slate-500"
                  : countdown.label === "Today" || countdown.label === "Tomorrow"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {countdown.label}
            </span>
          </div>
        </div>

        {/* Event Title */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug hover:text-blue-600 transition-colors">
          {event.title}
        </h2>

        {/* Content / Description Section */}
        {event.description && (
          <div className="mt-3 text-sm text-slate-600 leading-relaxed">
            <p className={isExpanded ? "whitespace-pre-line" : "line-clamp-3 whitespace-pre-line"}>
              {event.description}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                {isExpanded ? (
                  <>
                    <span>Show less</span> <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    <span>Read full circular</span> <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Meta Info Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          {/* Date & Time */}
          <div className="flex items-center gap-2.5">
            <Calendar size={15} className="text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-800">
              {countdown.formatted || event.date}
            </span>
            {event.startTime && (
              <span className="text-slate-500">
                ({event.startTime}{event.endTime && ` – ${event.endTime}`})
              </span>
            )}
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="text-rose-500 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-center gap-2.5">
              <Building2 size={15} className="text-indigo-600 shrink-0" />
              <span className="truncate">{event.organizer}</span>
            </div>
          )}

          {/* Department */}
          {event.department && (
            <div className="flex items-center gap-2.5">
              <span className="text-amber-600 font-bold">🎓</span>
              <span className="truncate">{event.department}</span>
            </div>
          )}
        </div>

        {/* Target Audience Badges: Branches & Semesters */}
        {((event.branch && event.branch.length > 0) || (event.semester && event.semester.length > 0)) && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Target:</span>
            {event.branch?.map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold"
              >
                {b}
              </span>
            ))}
            {event.semester?.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
              >
                Semester {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Left Action Buttons: Google Export & Calendar Link */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export to Google */}
          <button
            type="button"
            onClick={handleGoogleCalendarExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
            title="Export to Google Calendar"
          >
            <CalendarPlus size={14} className="text-blue-600" />
            <span className="hidden sm:inline">Google Calendar</span>
          </button>

          {/* View in Calendar */}
          <Link
            to={`/calendar?date=${encodeURIComponent(event.date)}&event=${event._id || event.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
            title="Open in calendar view"
          >
            <ExternalLink size={13} className="text-slate-500" />
            <span className="hidden sm:inline">View in Calendar</span>
          </Link>

          {/* Copy details */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="Copy notice details"
          >
            <Share2 size={13} className={copied ? "text-emerald-600" : ""} />
          </button>
        </div>

        {/* Right Action Button: Add to Schedule */}
        <button
          type="button"
          onClick={handleToggleSchedule}
          disabled={scheduling}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 ${
            isInSchedule
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {scheduling ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Updating...</span>
            </>
          ) : isInSchedule ? (
            <>
              <BookmarkCheck size={15} />
              <span>In Schedule</span>
            </>
          ) : (
            <>
              <Bookmark size={15} />
              <span>+ Add to Schedule</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default EventContentCard;
