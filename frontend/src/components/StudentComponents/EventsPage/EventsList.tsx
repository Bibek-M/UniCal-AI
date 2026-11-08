import React, { useState, useMemo } from "react";
import { Search, Filter, Calendar, LayoutGrid, List, RotateCcw } from "lucide-react";
import type { CalendarEvent, EventCategory } from "../../../types/calendar";
import EventContentCard from "./EventContentCard";

interface EventsListProps {
  events: CalendarEvent[];
  loading?: boolean;
  onToast?: (msg: { type: "success" | "error"; text: string }) => void;
}

// Helper to parse dates
function parseDateForSort(dateStr?: string): number {
  if (!dateStr) return 0;
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      if (parts[0].length === 2 && parts[2].length === 4) {
        // DD-MM-YYYY
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])).getTime();
      } else if (parts[0].length === 4) {
        // YYYY-MM-DD
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getTime();
      }
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

const CATEGORIES: { key: string; label: string; countCat?: EventCategory }[] = [
  { key: "all", label: "All Notices" },
  { key: "academic", label: "Academic & Exams", countCat: "academic" },
  { key: "deadline", label: "Deadlines", countCat: "deadline" },
  { key: "event", label: "Events", countCat: "event" },
  { key: "placement", label: "Placements", countCat: "placement" },
  { key: "holiday", label: "Holidays", countCat: "holiday" },
];

const EventsList: React.FC<EventsListProps> = ({ events, loading = false, onToast }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "upcoming" | "past">("all");
  const [sortOption, setSortOption] = useState<"upcoming" | "newest" | "title">("upcoming");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const todayTime = new Date().setHours(0, 0, 0, 0);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = events.filter((event) => {
      // Search
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        (event.description && event.description.toLowerCase().includes(q)) ||
        (event.location && event.location.toLowerCase().includes(q)) ||
        (event.department && event.department.toLowerCase().includes(q)) ||
        (event.organizer && event.organizer.toLowerCase().includes(q));

      // Category
      const matchesCategory =
        activeCategory === "all" || event.category === activeCategory;

      // Timeline (Upcoming vs Past)
      const eventTime = parseDateForSort(event.date);
      let matchesTimeline = true;
      if (timelineFilter === "upcoming") {
        matchesTimeline = eventTime >= todayTime;
      } else if (timelineFilter === "past") {
        matchesTimeline = eventTime < todayTime;
      }

      return matchesSearch && matchesCategory && matchesTimeline;
    });

    // Sort
    result.sort((a, b) => {
      const timeA = parseDateForSort(a.date);
      const timeB = parseDateForSort(b.date);

      if (sortOption === "upcoming") {
        // Upcoming dates ascending, past dates last
        return timeA - timeB;
      } else if (sortOption === "newest") {
        return timeB - timeA;
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [events, searchTerm, activeCategory, timelineFilter, sortOption, todayTime]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
    setTimelineFilter("all");
    setSortOption("upcoming");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col gap-4">
        {/* Top Controls: Search Bar & Sort / View toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search circulars by title, department, venue, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200">
              <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={(e: any) => setSortOption(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="upcoming">Upcoming First</option>
                <option value="newest">Latest Date First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {/* Timeline Filter */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimelineFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timelineFilter === "past"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Past
              </button>
            </div>

            {/* View Mode Toggle: Grid vs Feed */}
            <div className="hidden sm:inline-flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid layout"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Feed layout"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          <Filter size={14} className="text-slate-400 shrink-0 mr-1 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const count =
              cat.key === "all"
                ? events.length
                : events.filter((e) => e.category === cat.countCat).length;
            const isSelected = activeCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Fetching latest university circulars...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <Calendar size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No notices match your current filters
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            We couldn't find any notices matching "{searchTerm}" under the selected category or timeline.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Events Grid / Feed */}
      {!loading && filteredEvents.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-5"
              : "flex flex-col gap-5 max-w-4xl"
          }
        >
          {filteredEvents.map((event) => (
            <EventContentCard
              key={event._id || event.id || event.title}
              event={event}
              onToast={onToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;

