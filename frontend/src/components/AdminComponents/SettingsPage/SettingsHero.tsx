import { SlidersHorizontal, Shield } from "lucide-react";

const SettingsHero = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-300 px-6 py-5 rounded-2xl shadow-sm border border-blue-400/40 gap-3">
      <div>
        <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs uppercase tracking-wider">
          <Shield size={16} className="text-blue-800" />
          <span>Admin Profile & System Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Settings & Preferences
        </h1>
        <p className="text-slate-700 text-xs sm:text-sm mt-0.5 max-w-2xl">
          Manage your personal administrator profile, configure Google Calendar synchronization, and customize notification settings.
        </p>
      </div>
      <div className="px-3.5 py-1.5 rounded-xl bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0">
        <SlidersHorizontal size={14} />
        <span>Admin Suite v1.0</span>
      </div>
    </div>
  );
};

export default SettingsHero;

