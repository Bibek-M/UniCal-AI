import { useMemo } from "react";
import type { CalendarEvent } from "../types/calendar";
import EventDetails from "./EventDetails";

interface DateDetailsDrawerProps {
  date: string;
  events: CalendarEvent[];
  selectedEventId?: number;
  onClose: () => void;
}

const DateDetailsDrawer = ({
  date,
  events,
  selectedEventId,
  onClose,
}: DateDetailsDrawerProps) => {
  const formattedDate = useMemo(() => {
    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [date]);

  const visibleEvents = selectedEventId
    ? events.filter((event) => event.id === selectedEventId)
    : events;

  return (
    <div className="fixed inset-0 z-50">
      {/* Background */}
      <button
        aria-label="Close date details"
        onClick={onClose}
        className="
          absolute
          inset-0
          h-full
          w-full
          cursor-default
          bg-slate-950/30
          backdrop-blur-[2px]
        "
      />

      {/* Drawer */}
      <aside
        className="
          absolute
          right-0
          top-0
          flex
          h-full
          w-full
          max-w-xl
          flex-col
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-5
          "
        >
          <div>
            <p className="text-sm text-slate-500">
              {events.length} {events.length === 1 ? "event" : "events"}
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {formattedDate}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-xl
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
            "
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {visibleEvents.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-center">
              <div>
                <div className="text-4xl">📅</div>

                <h3 className="mt-4 font-medium text-slate-900">No events</h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are no events scheduled for this day.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleEvents.map((event) => (
                <EventDetails key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default DateDetailsDrawer;
