import type { CalendarEvent } from "../types/calendar";

interface EventDetailsProps {
  event: CalendarEvent;
}

const categoryLabels = {
  academic: "Academic",
  holiday: "Holiday",
  event: "Event",
  placement: "Placement",
  deadline: "Deadline",
};

const categoryColors = {
  academic: "bg-red-100 text-red-700",
  holiday: "bg-green-100 text-green-700",
  event: "bg-purple-100 text-purple-700",
  placement: "bg-orange-100 text-orange-700",
  deadline: "bg-blue-100 text-blue-700",
};

const EventDetails = ({ event }: EventDetailsProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        {/* Category indicator */}
        <div
          className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
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
          {/* Title */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {event.title}
            </h3>

            {event.isImportant && (
              <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                Important
              </span>
            )}
          </div>

          {/* Category */}
          <span
            className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-medium ${
              categoryColors[event.category]
            }`}
          >
            {categoryLabels[event.category]}
          </span>

          {/* Description */}
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {event.description}
          </p>

          {/* Information */}
          <div className="mt-4 space-y-2 text-sm">
            {event.startTime && (
              <div className="flex gap-3">
                <span>🕐</span>
                <span className="text-slate-600">
                  {event.startTime}
                  {event.endTime && ` – ${event.endTime}`}
                </span>
              </div>
            )}

            {event.location && (
              <div className="flex gap-3">
                <span>📍</span>
                <span className="text-slate-600">{event.location}</span>
              </div>
            )}

            {event.organizer && (
              <div className="flex gap-3">
                <span>🏛️</span>
                <span className="text-slate-600">{event.organizer}</span>
              </div>
            )}

            {event.department && (
              <div className="flex gap-3">
                <span>🎓</span>
                <span className="text-slate-600">{event.department}</span>
              </div>
            )}

            {event.branch && event.branch.length > 0 && (
              <div className="flex gap-3">
                <span>👥</span>
                <span className="text-slate-600">
                  {event.branch.join(", ")}
                </span>
              </div>
            )}

            {event.semester && event.semester.length > 0 && (
              <div className="flex gap-3">
                <span>📚</span>
                <span className="text-slate-600">
                  Semester {event.semester.join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Google Calendar */}
          <button
            className="
              mt-5
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            + Add to Google Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
