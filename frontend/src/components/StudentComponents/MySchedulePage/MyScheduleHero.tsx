import React from "react";
import { Bookmark, Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface MyScheduleHeroProps {
  totalCount: number;
  upcomingCount: number;
}

const MyScheduleHero: React.FC<MyScheduleHeroProps> = ({
  totalCount,
  upcomingCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-300 via-indigo-200 to-sky-200 px-8 py-6 rounded-2xl shadow-xs border border-blue-200/80 mb-6 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-600 text-white shadow-xs">
            Personal Dashboard
          </span>
          <span className="text-xs text-blue-900 font-medium flex items-center gap-1">
            <Sparkles size={13} className="text-blue-700" /> Synced with MongoDB
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Academic Schedule
        </h1>
        <p className="mt-1 text-sm text-slate-700 leading-relaxed">
          Your curated list of university events, examination schedules, college circulars, and academic deadlines.
        </p>

        {/* Quick summary badges */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="bg-white/85 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
            <Bookmark size={15} className="text-blue-600" />
            <span>
              <strong className="text-blue-700 font-bold">{totalCount}</strong> Saved {totalCount === 1 ? "Event" : "Events"}
            </span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
            <Calendar size={15} className="text-emerald-600" />
            <span>
              <strong className="text-emerald-700 font-bold">{upcomingCount}</strong> Upcoming
            </span>
          </div>

          <Link
            to="/calendar"
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline hover:no-underline px-2 py-1"
          >
            + Browse More Events in Calendar →
          </Link>
        </div>
      </div>

      <div className="hidden md:flex pr-6 z-10">
        <div className="p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-blue-200/80 shadow-md">
          <Bookmark size={68} className="text-blue-600 drop-shadow-sm" fill="#2563eb" />
        </div>
      </div>
    </div>
  );
};

export default MyScheduleHero;

