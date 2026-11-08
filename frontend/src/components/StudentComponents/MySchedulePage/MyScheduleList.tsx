import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CalendarPlus,
  Trash2,
  MapPin,
  Building2,
  Calendar as CalendarIcon,
  ArrowRight,
  Filter,
} from "lucide-react";
import type { StudentScheduleItem, EventCategory } from "../../../types/calendar";

interface MyScheduleListProps {
  schedules: StudentScheduleItem[];
  onRemove: (id: string | number) => Promise<{ success: boolean; message: string }>;
  loading?: boolean;
}

const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; badgeClass: string; dotClass: string }
> = {
  academic: {
    label: "Academic",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
  },
  holiday: {
    label: "Holiday",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  event: {
    label: "Event",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
  },
  placement: {
    label: "Placement",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    dotClass: "bg-orange-500",
  },
  deadline: {
    label: "Deadline",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
};

// Helper: Parse DD-MM-YYYY or YYYY-MM-DD into JS Date
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

// Helper: Calculate days remaining until event
function getDaysRemainingLabel(dateStr?: string): { text: string; isPast: boolean } {
  const eventDate = parseEventDate(dateStr);
  if (!eventDate) return { text: dateStr || "", isPast: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { text: "Today", isPast: false };
  if (diffDays === 1) return { text: "Tomorrow", isPast: false };
  if (diffDays > 1 && diffDays <= 7) return { text: `In ${diffDays} days`, isPast: false };
  if (diffDays > 7) return { text: `In ${diffDays} days`, isPast: false };
  if (diffDays === -1) return { text: "Yesterday", isPast: true };
  return { text: `${Math.abs(diffDays)} days ago`, isPast: true };
}

const MyScheduleList: React.FC<MyScheduleListProps> = ({
  schedules,
  onRemove,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "upcoming" | "past">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const event = item.event;
      if (!event) return false;

      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query)) ||
        (event.organizer && event.organizer.toLowerCase().includes(query)) ||
        (event.department && event.department.toLowerCase().includes(query));

      // Category match
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      // Timeline match
      const { isPast } = getDaysRemainingLabel(event.date);
      let matchesTimeline = true;
      if (timelineFilter === "upcoming") matchesTimeline = !isPast;
      if (timelineFilter === "past") matchesTimeline = isPast;

      return matchesSearch && matchesCategory && matchesTimeline;
    });
  }, [schedules, searchTerm, selectedCategory, timelineFilter]);

  const handleRemove = async (scheduleId: string, eventId?: string | number) => {
    setDeletingId(scheduleId);
    try {
      await onRemove(scheduleId || (eventId as string));
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportToGoogle = (event: any) => {
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
      text: event.title || "University Event",
      dates: `${dateStr}/${dateStr}`,
      details: `${event.description || ""}\n\nLocation: ${event.location || "Campus"}`,
      location: event.location || "Campus",
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search scheduled events by title, venue, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeline filter */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimelineFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timelineFilter === "all"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTimelineFilter("upcoming")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timelineFilter === "upcoming"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setTimelineFilter("past")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timelineFilter === "past"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Past
            </button>
          </div>

          {/* Category Dropdown/Selector */}
          <div className="flex items-center gap-1.5 pl-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-100 border-none rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="deadline">Deadlines</option>
              <option value="holiday">Holidays</option>
              <option value="placement">Placements</option>
              <option value="event">Campus Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Loading your schedule...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSchedules.length === 0 && (
        <div className="py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <CalendarIcon size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {schedules.length === 0
              ? "Your personal schedule is empty"
              : "No events match your current filter"}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {schedules.length === 0
              ? "Explore the university calendar and click '+ Add to Schedule' on any academic circular, exam, or deadline to keep track here."
              : "Try clearing your search term or selecting another category filter above."}
          </p>

          <div className="mt-5">
            {schedules.length === 0 ? (
              <Link
                to="/calendar"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <span>Browse University Calendar</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setTimelineFilter("all");
                }}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Schedule Items List */}
      {!loading && filteredSchedules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.map((item) => {
            const event = item.event;
            const categoryMeta =
              CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.event;
            const remaining = getDaysRemainingLabel(event.date);

            return (
              <div
                key={item._id}
                className="group relative rounded-xl border border-slate-200/90 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Header: Category badge & Days remaining countdown */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border capitalize ${categoryMeta.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${categoryMeta.dotClass}`}
                        />
                        {categoryMeta.label}
                      </span>

                      {event.isImportant && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-700">
                          Important
                        </span>
                      )}
                    </div>

                    {/* Countdown Pill */}
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        remaining.isPast
                          ? "bg-slate-100 text-slate-500"
                          : remaining.text === "Today" || remaining.text === "Tomorrow"
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {remaining.text}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>

                  {/* Description */}
                  {event.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* Meta Details Rows */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {event.date}
                      </span>
                      {event.startTime && (
                        <span className="text-slate-500">
                          ({event.startTime}
                          {event.endTime && ` - ${event.endTime}`})
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Department / Organizer */}
                    {(event.department || event.organizer) && (
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400 shrink-0" />
                        <span>{event.department || event.organizer}</span>
                      </div>
                    )}

                    {/* Branches / Semesters tags */}
                    {((event.branch && event.branch.length > 0) ||
                      (event.semester && event.semester.length > 0)) && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {event.branch?.map((b) => (
                          <span
                            key={b}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600"
                          >
                            {b}
                          </span>
                        ))}
                        {event.semester?.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600"
                          >
                            Sem {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  {/* Google Calendar export */}
                  <button
                    type="button"
                    onClick={() => handleExportToGoogle(event)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    title="Add to Google Calendar"
                  >
                    <CalendarPlus size={14} />
                    <span>Google Calendar</span>
                  </button>

                  {/* Remove from Schedule */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item._id, item.eventId || event._id || event.id)}
                    disabled={deletingId === item._id}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer disabled:opacity-50"
                    title="Remove from my schedule"
                  >
                    <Trash2 size={13} />
                    <span>{deletingId === item._id ? "Removing..." : "Remove"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyScheduleList;
