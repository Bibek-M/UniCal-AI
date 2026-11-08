import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Star, ArrowRight, CalendarPlus } from "lucide-react";
import type { CalendarEvent, EventCategory } from "../../../types/calendar";

const CATEGORY_COLORS: Record<EventCategory, string> = {
  academic: "bg-red-50 text-red-700 border-red-200",
  holiday: "bg-green-50 text-green-700 border-green-200",
  event: "bg-purple-50 text-purple-700 border-purple-200",
  placement: "bg-orange-50 text-orange-700 border-orange-200",
  deadline: "bg-blue-50 text-blue-700 border-blue-200",
};

interface AdminUpcomingEventsProps {
  events: CalendarEvent[];
  loading: boolean;
}

const AdminUpcomingEvents: React.FC<AdminUpcomingEventsProps> = ({ events, loading }) => {
  // Show up to 5 events
  const displayEvents = events.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <span>Upcoming University Events</span>
            </h2>
            <p className="text-2xs text-slate-500">
              Latest scheduled academic milestones, tests, and campus gatherings.
            </p>
          </div>
          <Link
            to="/manageEvents"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading events...
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400">
              <CalendarPlus size={24} />
            </div>
            <p className="text-xs text-slate-500">No events scheduled yet.</p>
            <Link
              to="/manageEvents"
              className="text-xs text-blue-600 font-semibold underline hover:text-blue-800"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayEvents.map((ev) => (
              <div
                key={ev._id || String(ev.id)}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider border ${
                        CATEGORY_COLORS[ev.category] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {ev.category}
                    </span>
                    {ev.isImportant && (
                      <span className="flex items-center gap-0.5 text-2xs font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                        <Star size={10} className="fill-red-600 text-red-600" />
                        Important
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {ev.title}
                  </h3>
                  <p className="text-slate-500 text-2xs line-clamp-1 mt-0.5">
                    {ev.description}
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col sm:items-end gap-1.5 sm:gap-1 text-2xs text-slate-500 shrink-0 font-mono">
                  <div className="flex items-center gap-1 font-bold text-slate-700">
                    <Calendar size={12} className="text-blue-600" />
                    <span>{ev.date}</span>
                  </div>
                  {ev.startTime && (
                    <div className="flex items-center gap-1 text-slate-500 font-normal">
                      <Clock size={11} className="text-slate-400" />
                      <span>{ev.startTime}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-1 text-slate-500 font-sans truncate max-w-32">
                      <MapPin size={11} className="text-red-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
        <span>Showing {displayEvents.length} of {events.length} total events</span>
        <Link
          to="/manageEvents"
          className="font-semibold text-blue-600 hover:underline"
        >
          + Add another event
        </Link>
      </div>
    </div>
  );
};

export default AdminUpcomingEvents;

