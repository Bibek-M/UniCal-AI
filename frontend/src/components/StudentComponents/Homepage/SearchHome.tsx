import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { useEvents } from "../../../hooks/useEvents";
import type { CalendarEvent, EventCategory } from "../../../types/calendar";

const CATEGORY_COLORS: Record<EventCategory, { badge: string; dot: string; label: string }> = {
  academic: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", label: "Academic" },
  holiday: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", label: "Holiday" },
  event: { badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500", label: "Event" },
  placement: { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500", label: "Placement" },
  deadline: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", label: "Deadline" },
};

const SearchHome = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { events } = useEvents();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching events based on query
  const matchingEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return events
      .filter((event) => {
        return (
          event.title.toLowerCase().includes(q) ||
          (event.description && event.description.toLowerCase().includes(q)) ||
          (event.category && event.category.toLowerCase().includes(q)) ||
          (event.location && event.location.toLowerCase().includes(q)) ||
          (event.department && event.department.toLowerCase().includes(q)) ||
          (event.organizer && event.organizer.toLowerCase().includes(q))
        );
      })
      .slice(0, 6); // Top 6 matching results
  }, [query, events]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setIsOpen(false);
    const eventId = event._id || event.id;
    // Navigate directly to Calendar page with date and event query params to open drawer
    navigate(`/calendar?date=${encodeURIComponent(event.date)}&event=${eventId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsOpen(false);
      if (matchingEvents.length > 0) {
        // Go directly to first match
        handleSelectEvent(matchingEvents[0]);
      } else if (query.trim()) {
        // Search generally in calendar
        navigate(`/calendar?search=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 bg-white w-full rounded-2xl px-4 py-2.5 shadow-sm border border-slate-200/90 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search for academic notices, exams, holidays, workshops..."
          className="w-full outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Real-Time Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {matchingEvents.length > 0
                ? `Found ${matchingEvents.length} events for "${query}"`
                : `No events found for "${query}"`}
            </span>
            <span className="text-[11px] text-slate-400">Press Enter to open</span>
          </div>

          {/* Results List */}
          {matchingEvents.length > 0 ? (
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {matchingEvents.map((event) => {
                const catMeta = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.event;
                return (
                  <button
                    key={event._id || event.id || event.title}
                    type="button"
                    onClick={() => handleSelectEvent(event)}
                    className="w-full text-left p-3.5 hover:bg-blue-50/70 transition-colors flex items-start gap-3 group cursor-pointer"
                  >
                    {/* Category dot */}
                    <span
                      className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${catMeta.dot}`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {event.title}
                        </h4>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${catMeta.badge}`}
                        >
                          {catMeta.label}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {event.description}
                        </p>
                      )}

                      {/* Meta badges: Date, Time, Venue */}
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar size={12} className="text-slate-400" />
                          {event.date}
                        </span>

                        {event.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {event.startTime}
                          </span>
                        )}

                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all self-center shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              <p>No university notices or events match your search term.</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/calendar?search=${encodeURIComponent(query.trim())}`);
                }}
                className="mt-2 text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Search full calendar instead →
              </button>
            </div>
          )}

          {/* Footer action */}
          {matchingEvents.length > 0 && (
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/calendar?search=${encodeURIComponent(query.trim())}`);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1 w-full cursor-pointer py-1"
              >
                <span>View all calendar events for "{query}"</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchHome;
