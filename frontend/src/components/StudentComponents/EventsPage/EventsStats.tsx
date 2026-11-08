import React from "react";
import { GraduationCap, AlertCircle, Briefcase, CalendarCheck } from "lucide-react";
import type { CalendarEvent } from "../../../types/calendar";

interface EventsStatsProps {
  events: CalendarEvent[];
}

const EventsStats: React.FC<EventsStatsProps> = ({ events }) => {
  const academicCount = events.filter((e) => e.category === "academic").length;
  const deadlineCount = events.filter((e) => e.category === "deadline").length;
  const placementCount = events.filter((e) => e.category === "placement" || e.category === "event").length;
  const holidayCount = events.filter((e) => e.category === "holiday").length;

  const statItems = [
    {
      label: "Academic & Exams",
      value: academicCount,
      icon: GraduationCap,
      color: "text-red-600 bg-red-50 border-red-200",
    },
    {
      label: "Deadlines & Submissions",
      value: deadlineCount,
      icon: AlertCircle,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Events & Placements",
      value: placementCount,
      icon: Briefcase,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      label: "Holidays & Recesses",
      value: holidayCount,
      icon: CalendarCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {statItems.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow"
          >
            <div className={`p-2.5 rounded-xl border ${stat.color} shrink-0`}>
              <Icon size={20} />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 block leading-tight">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsStats;

