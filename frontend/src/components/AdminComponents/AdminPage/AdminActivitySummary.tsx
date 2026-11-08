import React from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Calendar,
  HelpCircle,
  Home,
  Database,
} from "lucide-react";
import type { CalendarEvent } from "../../../types/calendar";

interface AdminActivitySummaryProps {
  events: CalendarEvent[];
  faqsCount: number;
}

const AdminActivitySummary: React.FC<AdminActivitySummaryProps> = ({
  events,
  faqsCount,
}) => {
  const total = events.length || 1; // avoid divide by zero

  const academicCount = events.filter((e) => e.category === "academic").length;
  const holidayCount = events.filter((e) => e.category === "holiday").length;
  const eventCount = events.filter((e) => e.category === "event").length;
  const placementCount = events.filter((e) => e.category === "placement").length;
  const deadlineCount = events.filter((e) => e.category === "deadline").length;

  const categories = [
    { label: "Academic & Exams", count: academicCount, color: "bg-red-500", bar: "bg-red-500" },
    { label: "Campus Events", count: eventCount, color: "bg-purple-500", bar: "bg-purple-500" },
    { label: "Holidays", count: holidayCount, color: "bg-green-500", bar: "bg-green-500" },
    { label: "Placements", count: placementCount, color: "bg-orange-500", bar: "bg-orange-500" },
    { label: "Deadlines", count: deadlineCount, color: "bg-blue-500", bar: "bg-blue-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Category Breakdown (Col 1 & 2) */}
      <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <PieChart size={18} className="text-blue-600" />
                <span>Events Distribution by Category</span>
              </h2>
              <p className="text-2xs text-slate-500">
                Visual proportion of academic schedules, holidays, and campus opportunities.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              {events.length} Total
            </span>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat) => {
              const pct = Math.round((cat.count / total) * 100);
              return (
                <div key={cat.label} className="text-xs">
                  <div className="flex justify-between items-center mb-1 font-medium">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                      {cat.label}
                    </span>
                    <span className="text-slate-500 font-mono text-2xs">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
          <span>Active schedule sync: Real-time student calendars updated</span>
          <Link to="/manageEvents" className="font-semibold text-blue-600 hover:underline">
            Manage Categories
          </Link>
        </div>
      </div>

      {/* System Status & Preview Shortcuts (Col 3) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <ShieldCheck size={18} className="text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">System Status</h2>
              <p className="text-2xs text-slate-500">Services operational</p>
            </div>
          </div>

          <div className="space-y-2.5 mb-5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <Database size={13} className="text-blue-600" /> MongoDB Database
              </span>
              <span className="flex items-center gap-1 text-2xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={11} /> Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <ShieldCheck size={13} className="text-indigo-600" /> JWT Auth Engine
              </span>
              <span className="flex items-center gap-1 text-2xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={11} /> Active
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 flex items-center gap-1.5 font-medium">
                <HelpCircle size={13} className="text-purple-600" /> Student Help Desk
              </span>
              <span className="text-2xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {faqsCount} FAQs Online
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-700 mb-2">
            Student Experience Previews
          </div>

          <div className="space-y-1.5">
            <Link
              to="/calendar"
              className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs text-slate-700 hover:text-blue-700 transition-all font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-blue-600" /> Student Calendar
              </span>
              <ExternalLink size={12} className="text-slate-400" />
            </Link>

            <Link
              to="/help"
              className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-xs text-slate-700 hover:text-purple-700 transition-all font-medium"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle size={13} className="text-purple-600" /> FAQs Help Center
              </span>
              <ExternalLink size={12} className="text-slate-400" />
            </Link>

            <Link
              to="/home"
              className="flex items-center justify-between p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs text-slate-700 transition-all font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Home size={13} className="text-slate-600" /> Student Home Portal
              </span>
              <ExternalLink size={12} className="text-slate-400" />
            </Link>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 text-3xs text-slate-400 text-center">
          Unical AI Administrative Suite v1.0
        </div>
      </div>
    </div>
  );
};

export default AdminActivitySummary;

