import React from "react";
import { Settings, ShieldCheck, Bell, Sparkles } from "lucide-react";

interface SettingsHeroProps {
  studentName?: string;
}

const SettingsHero: React.FC<SettingsHeroProps> = ({ studentName }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-200 via-indigo-100 to-sky-100 px-6 sm:px-8 py-6 rounded-2xl shadow-xs border border-blue-200/80 mb-6 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-blue-300/30 rounded-full blur-2xl pointer-events-none" />

      <div className="z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-600 text-white shadow-xs flex items-center gap-1">
            <Settings size={12} /> Student Account
          </span>
          <span className="text-xs text-blue-900 font-medium flex items-center gap-1">
            <ShieldCheck size={13} className="text-blue-700" /> Verified Portal Profile
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Settings & Preferences
        </h1>
        <p className="mt-1 text-sm text-slate-700 leading-relaxed">
          {studentName ? `Welcome, ${studentName}. ` : ""}
          Manage your notification preferences, alert timings, and view verified academic enrollment details.
        </p>

        {/* Info Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="bg-white/85 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
            <Bell size={14} className="text-blue-600" />
            <span>Customizable Notifications</span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Official University Record</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex pr-6 z-10">
        <div className="p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-blue-200/80 shadow-md text-blue-600">
          <Settings size={60} className="drop-shadow-xs" />
        </div>
      </div>
    </div>
  );
};

export default SettingsHero;

