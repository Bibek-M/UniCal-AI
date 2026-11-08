import React from "react";
import { GraduationCap, AlertCircle, CalendarCheck, Briefcase } from "lucide-react";
import type { StudentScheduleItem } from "../../../types/calendar";

interface MyScheduleStatsProps {
  schedules: StudentScheduleItem[];
}

const MyScheduleStats: React.FC<MyScheduleStatsProps> = ({ schedules }) => {
  const academicCount = schedules.filter(
    (s) => s.event?.category === "academic"
  ).length;

  const deadlineCount = schedules.filter(
    (s) => s.event?.category === "deadline"
  ).length;

  const holidayCount = schedules.filter(
    (s) => s.event?.category === "holiday"
  ).length;

  const placementCount = schedules.filter(
    (s) => s.event?.category === "placement" || s.event?.category === "event"
  ).length;

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
      label: "Campus Events & Drives",
      value: placementCount,
      icon: Briefcase,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      label: "Holidays & Breaks",
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

export default MyScheduleStats;

