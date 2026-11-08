import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { CalendarEvent, EventCategory } from "../../../types/calendar";

interface HomeCalendarProps {
  events: CalendarEvent[];
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string; dot: string; label: string }> = {
  academic: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Academic" },
  holiday: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Holiday" },
  event: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500", label: "Event" },
  placement: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500", label: "Placement" },
  deadline: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", label: "Deadline" },
};

export const HomeCalendar: React.FC<HomeCalendarProps> = ({ events }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Generate exact 42 cells (6 rows x 7 cols) for perfect aspect ratio
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Date[] = [];

    // Previous month padding
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Next month padding to reach 42 cells
    while (days.length < 42) {
      days.push(new Date(year, month, days.length - startingDay + 1));
    }

    return days;
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    const ddmmyyyy = formatDate(date);
    const yyyymmdd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return events.filter(
      (event) => event.date === ddmmyyyy || event.date === yyyymmdd
    );
  };

  const changeMonth = (amount: number) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date, eventId?: string | number) => {
    const ddmmyyyy = formatDate(date);
    const yyyymm = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    let targetUrl = `/calendar?month=${yyyymm}&date=${ddmmyyyy}`;
    if (eventId) {
      targetUrl += `&event=${eventId}`;
    }
    navigate(targetUrl);
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50/70 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 cursor-pointer h-7 w-7 text-xs font-bold"
          >
            ←
          </button>

          <h2 className="font-bold text-slate-900 tracking-tight text-xs sm:text-sm min-w-[120px] sm:min-w-[150px]">
            {monthName}
          </h2>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 cursor-pointer h-7 w-7 text-xs font-bold"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg border border-slate-200 font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer px-2.5 py-1 text-[11px]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => navigate("/calendar")}
            className="rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition px-2.5 py-1 text-[11px] hidden sm:inline-block cursor-pointer"
          >
            Full View →
          </button>
        </div>
      </div>

      {/* Weekday Labels (Sun - Sat) */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 py-1 shrink-0">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-bold uppercase tracking-wider text-[11px] text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 42-Cell Days Grid: 7 columns x 6 rows distributed evenly */}
      <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-[380px] lg:min-h-0 w-full overflow-hidden">
        {calendarDays.map((date, index) => {
          const dateString = formatDate(date);
          const isCurrentMonth =
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
          const dayEvents = getEventsForDay(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={`${dateString}-${index}`}
              onClick={() => handleDateClick(date, dayEvents[0]?._id || dayEvents[0]?.id)}
              className={`
                group
                w-full
                h-full
                border-b
                border-r
                border-slate-200/80
                p-1
                sm:p-1.5
                flex
                flex-col
                justify-between
                transition-colors
                cursor-pointer
                hover:bg-blue-50/50
                overflow-hidden
                ${!isCurrentMonth ? "bg-slate-50/50" : "bg-white"}
              `}
            >
              {/* Date Number Badge */}
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`
                    flex
                    items-center
                    justify-center
                    rounded-full
                    font-bold
                    h-5
                    w-5
                    sm:h-5.5
                    sm:w-5.5
                    text-[11px]
                    ${
                      isCurrentDay
                        ? "bg-blue-600 text-white shadow-xs"
                        : isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }
                  `}
                >
                  {date.getDate()}
                </span>

                {/* Event count dot on mobile if multiple */}
                {dayEvents.length > 0 && (
                  <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Event Snippets */}
              <div className="space-y-0.5 overflow-hidden flex-1 flex flex-col justify-end">
                {dayEvents.slice(0, 2).map((event) => {
                  const style =
                    CATEGORY_STYLES[event.category] || CATEGORY_STYLES.event;
                  return (
                    <div
                      key={event.id ?? event._id}
                      className={`
                        truncate
                        rounded
                        font-semibold
                        px-1
                        py-0.2
                        text-[9px]
                        sm:text-[10px]
                        leading-tight
                        ${style.bg}
                        ${style.text}
                      `}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  );
                })}

                {dayEvents.length > 2 && (
                  <div className="font-bold text-blue-600 text-[9px] leading-tight px-0.5">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap items-center px-3 sm:px-4 py-1.5 gap-2 sm:gap-4 border-t border-slate-200/90 bg-slate-50/60 shrink-0 text-[10px] sm:text-[11px] text-slate-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span>Academic</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Holiday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
          <span>Event</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
          <span>Placement</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span>Deadline</span>
        </div>
      </div>
    </div>
  );
};

export default HomeCalendar;

