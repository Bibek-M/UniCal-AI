import { useSearchParams } from "react-router-dom";

// import  from "../components/MainCalendar";
import MainCalendar from "../components/MainCalender"
import DateDetailsDrawer from "../components/DataDetailsDrawer";

import { mockEvents } from "../data/mockEvents";

const CalendarPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDate = searchParams.get("date");
  const selectedEventId = searchParams.get("event");
  const selectedEvents = selectedDate
    ? mockEvents.filter((event) => event.date === selectedDate)
    : [];

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);

    newParams.delete("date");
    newParams.delete("event");

    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            University Calendar
          </h1>

          <p className="mt-1 text-slate-500">
            All your academic events, holidays, exams and activities in one
            place.
          </p>
        </div>

        {/* Calendar */}
        <MainCalendar events={mockEvents} />
      </div>

      {/* Date drawer */}
      {selectedDate && (
        <DateDetailsDrawer
          date={selectedDate}
          events={selectedEvents}
          selectedEventId={
            selectedEventId ? Number(selectedEventId) : undefined
          }
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default CalendarPage;
