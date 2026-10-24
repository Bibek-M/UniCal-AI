import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { CalendarEvent } from "../types/calendar";

interface MainCalendarProps {
  events: CalendarEvent[];
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MainCalendar = ({ events }: MainCalendarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Current month is controlled through URL.
   *
   * /calendar?month=2026-09
   *
   * This means refreshing the page keeps the month.
   */
  const monthParam = searchParams.get("month");

  const currentDate = useMemo(() => {
    if (monthParam) {
      const [year, month] = monthParam.split("-").map(Number);

      if (year && month) {
        return new Date(year, month - 1, 1);
      }
    }

    return new Date();
  }, [monthParam]);

  /*
   * Format Date → YYYY-MM-DD
   */
  const formatDate = (date: Date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * Format Date → YYYY-MM
   */
  const formatMonth = (date: Date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
  };

  /*
   * Check if date is today.
   */
  const isToday = (date: Date) => {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  /*
   * Generate 42 calendar cells.
   */
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const startingDay = firstDay.getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Date[] = [];

    /*
     * Previous month
     */
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    /*
     * Current month
     */
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    /*
     * Next month
     */
    while (days.length < 42) {
      days.push(new Date(year, month, days.length - startingDay + 1));
    }

    return days;
  }, [currentDate]);

  /*
   * Events for a specific date.
   */
  const getEventsForDay = (date: Date) => {
    const dateString = formatDate(date);

    return events.filter((event) => event.date === dateString);
  };

  /*
   * Change month.
   */
  const changeMonth = (amount: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + amount,
      1
    );

    const newParams = new URLSearchParams(searchParams);

    newParams.set("month", formatMonth(newDate));

    /*
     * If a date is currently selected,
     * remove it when changing month.
     */
    newParams.delete("date");
    newParams.delete("event");

    setSearchParams(newParams);
  };

  /*
   * Go to current month.
   */
  const goToToday = () => {
    const today = new Date();

    const newParams = new URLSearchParams(searchParams);

    newParams.set("month", formatMonth(today));

    newParams.delete("date");
    newParams.delete("event");

    setSearchParams(newParams);
  };

  /*
   * Select date.
   *
   * Example:
   *
   * /calendar?month=2026-09&date=2026-09-10
   */
  const handleDateClick = (date: Date) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("month", formatMonth(date));

    newParams.set("date", formatDate(date));

    newParams.delete("event");

    setSearchParams(newParams);
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedDate = searchParams.get("date");

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeMonth(-1)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              text-lg
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            ←
          </button>

          <h2 className="min-w-[190px] text-xl font-semibold text-slate-900">
            {monthName}
          </h2>

          <button
            onClick={() => changeMonth(1)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              text-lg
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            →
          </button>
        </div>

        <button
          onClick={goToToday}
          className="
            rounded-lg
            border
            border-slate-200
            px-4
            py-2
            text-sm
            font-medium
            text-slate-700
            transition
            hover:bg-slate-100
          "
        >
          Today
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="
              py-3
              text-center
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-500
            "
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const dateString = formatDate(date);

          const currentMonth =
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();

          const dayEvents = getEventsForDay(date);

          const selected = selectedDate === dateString;

          return (
            <button
              type="button"
              key={`${dateString}-${index}`}
              onClick={() => handleDateClick(date)}
              className={`
                group
                min-h-31.25
                w-full
                border-b
                border-r
                border-slate-200
                p-2
                text-left
                transition
                hover:bg-blue-50/40

                ${!currentMonth ? "bg-slate-50/70" : "bg-white"}

                ${selected ? "bg-blue-50 ring-2 ring-inset ring-blue-500" : ""}
              `}
            >
              {/* Date number */}
              <div className="mb-2 flex items-center">
                <span
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    text-sm
                    font-medium

                    ${
                      isToday(date)
                        ? "bg-blue-600 text-white"
                        : currentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }
                  `}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`
                        truncate
                        rounded-md
                        px-2
                        py-1
                        text-xs
                        font-medium

                        ${
                          event.category === "academic"
                            ? "bg-red-100 text-red-700"
                            : event.category === "holiday"
                            ? "bg-green-100 text-green-700"
                            : event.category === "event"
                            ? "bg-purple-100 text-purple-700"
                            : event.category === "placement"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                  >
                    {event.title}
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <div className="px-2 text-xs font-medium text-blue-600">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 border-t border-slate-200 px-6 py-4">
        <Legend color="bg-red-500" label="Academic" />

        <Legend color="bg-green-500" label="Holiday" />

        <Legend color="bg-purple-500" label="Event" />

        <Legend color="bg-orange-500" label="Placement" />

        <Legend color="bg-blue-500" label="Deadline" />
      </div>
    </div>
  );
};

interface LegendProps {
  color: string;
  label: string;
}

const Legend = ({ color, label }: LegendProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
};

export default MainCalendar;
