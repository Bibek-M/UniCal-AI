"use client";

import { useMemo, useState } from "react";

type EventCategory =
  | "academic"
  | "holiday"
  | "event"
  | "placement"
  | "deadline";

interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  category: EventCategory;
  time?: string;
}

const events: CalendarEvent[] = [
  {
    id: 1,
    title: "Mid Semester Exams",
    date: "2026-09-10",
    category: "academic",
  },
  {
    id: 2,
    title: "Hackathon 2026",
    date: "2026-09-12",
    category: "event",
    time: "10:00 AM",
  },
  {
    id: 3,
    title: "Project Submission",
    date: "2026-09-15",
    category: "deadline",
    time: "11:59 PM",
  },
  {
    id: 4,
    title: "Industry Visit",
    date: "2026-09-18",
    category: "event",
  },
  {
    id: 5,
    title: "Gandhi Jayanti",
    date: "2026-09-22",
    category: "holiday",
  },
  {
    id: 6,
    title: "Placement Drive",
    date: "2026-09-25",
    category: "placement",
    time: "9:00 AM",
  },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const categoryStyles: Record<EventCategory, string> = {
  academic: "bg-red-100 text-red-700 border border-red-200",
  holiday: "bg-green-100 text-green-700 border border-green-200",
  event: "bg-purple-100 text-purple-700 border border-purple-200",
  placement: "bg-orange-100 text-orange-700 border border-orange-200",
  deadline: "bg-blue-100 text-blue-700 border border-blue-200",
};

const MainCalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  /*
   * Returns YYYY-MM-DD.
   */
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * Check whether two dates represent the same day.
   */
  const isSameDay = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  /*
   * Get all days that need to be displayed in the calendar.
   *
   * Example:
   *
   * September 2026
   *
   * If September starts on Tuesday:
   *
   * Sun Mon Tue Wed Thu Fri Sat
   * 30  31   1   2   3   4   5
   */
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Date[] = [];

    // Previous month's days
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Next month's days
    const remainingDays = 42 - days.length;

    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  }, [currentDate]);

  /*
   * Move to previous month.
   */
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  /*
   * Move to next month.
   */
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  /*
   * Return to today's month.
   */
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  /*
   * Find events belonging to a particular day.
   */
  const getEventsForDay = (date: Date) => {
    const dateString = formatDate(date);

    return events.filter((event) => event.date === dateString);
  };

  /*
   * Month title.
   *
   * Example:
   * September 2026
   */
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();

  return (
    <div className="max-w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="Previous month"
          >
            ←
          </button>

          <h2 className="min-w-180px text-xl font-semibold text-slate-900">
            {monthName}
          </h2>

          <button
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        {/* Today Button */}
        <button
          onClick={goToToday}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Today
        </button>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          const isToday = isSameDay(date, today);

          const dayEvents = getEventsForDay(date);

          return (
            <div
              key={`${formatDate(date)}-${index}`}
              className={`
                min-h-31.25
                border-b border-r border-slate-200
                p-2
                transition
                hover:bg-slate-50
                ${!isCurrentMonth ? "bg-slate-50/70" : ""}
              `}
            >
              {/* Date Number */}
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`
                    flex h-7 w-7 items-center justify-center
                    rounded-full text-sm
                    ${
                      isToday
                        ? "bg-blue-600 font-semibold text-white"
                        : isCurrentMonth
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
                  <button
                    key={event.id}
                    className={`
                      w-full
                      truncate
                      rounded-md
                      px-2
                      py-1
                      text-left
                      text-xs
                      font-medium
                      transition
                      hover:opacity-80
                      ${categoryStyles[event.category]}
                    `}
                  >
                    {event.title}
                  </button>
                ))}

                {/* More events */}
                {dayEvents.length > 3 && (
                  <button className="px-2 text-xs font-medium text-blue-600">
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
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

/*
 * Small reusable legend component.
 */
const Legend = ({ color, label }: { color: string; label: string }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

      {label}
    </div>
  );
};

export default MainCalender;