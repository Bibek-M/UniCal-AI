import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Users,
  HelpCircle,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface AdminStatCardsProps {
  totalEvents: number;
  importantEvents: number;
  totalUsers: number;
  studentCount: number;
  facultyCount: number;
  totalFaqs: number;
  loading: boolean;
}

const AdminStatCards: React.FC<AdminStatCardsProps> = ({
  totalEvents,
  importantEvents,
  totalUsers,
  studentCount,
  facultyCount,
  totalFaqs,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Events Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Events
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={18} />
          </div>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? "..." : totalEvents}
          </div>
          <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="font-semibold text-blue-600">
              {importantEvents}
            </span>{" "}
            marked high priority
          </div>
        </div>

        <Link
          to="/manageEvents"
          className="flex items-center justify-between text-2xs font-semibold text-blue-600 hover:text-blue-800 pt-2 border-t border-slate-100 group"
        >
          <span>Manage university events</span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Total Users Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Registered Users
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Users size={18} />
          </div>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? "..." : totalUsers}
          </div>
          <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
            <span className="font-semibold text-emerald-600">{studentCount}</span> Students
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700">{facultyCount}</span> Faculty
          </div>
        </div>

        <Link
          to="/users"
          className="flex items-center justify-between text-2xs font-semibold text-emerald-600 hover:text-emerald-800 pt-2 border-t border-slate-100 group"
        >
          <span>View user directory</span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Published FAQs Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Help Desk FAQs
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <HelpCircle size={18} />
          </div>
        </div>

        <div className="my-3">
          <div className="text-2xl font-extrabold text-slate-900">
            {loading ? "..." : totalFaqs}
          </div>
          <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Knowledge base active
          </div>
        </div>

        <Link
          to="/manageFaqs"
          className="flex items-center justify-between text-2xs font-semibold text-purple-600 hover:text-purple-800 pt-2 border-t border-slate-100 group"
        >
          <span>Curate student FAQs</span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Academic Term Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Current Term
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <GraduationCap size={18} />
          </div>
        </div>

        <div className="my-3">
          <div className="text-xl font-extrabold text-slate-900 truncate">
            Spring 2026
          </div>
          <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Sparkles size={11} className="text-amber-500" />
            Mid-term Examination Phase
          </div>
        </div>

        <Link
          to="/calendar"
          className="flex items-center justify-between text-2xs font-semibold text-amber-600 hover:text-amber-800 pt-2 border-t border-slate-100 group"
        >
          <span>Preview student calendar</span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
};

export default AdminStatCards;
