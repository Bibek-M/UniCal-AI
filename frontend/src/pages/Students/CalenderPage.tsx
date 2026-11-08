import { useSearchParams } from "react-router-dom";
import MainCalendar from "../../components/StudentComponents/MainCalender";
import DateDetailsDrawer from "../../components/StudentComponents/DataDetailsDrawer";
import { useEvents } from "../../hooks/useEvents";
import { Search, X } from "lucide-react";

const CalendarPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, loading, error } = useEvents();

  const selectedDate = searchParams.get("date");
  const selectedEventId = searchParams.get("event");
  const searchQuery = searchParams.get("search");

  // If a search query is passed without a specific date selected, auto-select first matching event
  let effectiveDate = selectedDate;
  let effectiveEventId = selectedEventId;

  if (!effectiveDate && searchQuery && events.length > 0) {
    const q = searchQuery.toLowerCase();
    const matched = events.find(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q))
    );
    if (matched) {
      effectiveDate = matched.date;
      effectiveEventId = String(matched._id || matched.id);
    }
  }

  const selectedEvents = effectiveDate
    ? events.filter((event) => event.date === effectiveDate)
    : [];

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);

    newParams.delete("date");
    newParams.delete("event");
    newParams.delete("search");

    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              University Calendar
            </h1>

            <p className="mt-1 text-slate-500">
              All your academic events, holidays, exams and activities in one place.
            </p>

            {/* Active search filter badge */}
            {searchQuery && (
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
                <Search size={13} />
                <span>Searching: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-red-600 cursor-pointer"
                  title="Clear search filter"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          {loading && (
            <span className="text-sm text-blue-600 animate-pulse">
              Loading events...
            </span>
          )}
          {error && (
            <span className="text-sm text-amber-600">
              Unable to sync live events: {error}
            </span>
          )}
        </div>

        {/* Calendar */}
        <MainCalendar events={events} />
      </div>

      {/* Date drawer */}
      {effectiveDate && (
        <DateDetailsDrawer
          date={effectiveDate}
          events={selectedEvents}
          selectedEventId={
            effectiveEventId
              ? isNaN(Number(effectiveEventId))
                ? effectiveEventId
                : Number(effectiveEventId)
              : undefined
          }
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default CalendarPage;
