import { Link } from "react-router-dom";
import { CalendarPlus, HelpCircle, Users, Sparkles, ShieldCheck } from "lucide-react";
import { getUser } from "../../../utils/auth";

const AdminDashboardHero = () => {
  const user = getUser();
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-blue-300 px-6 py-5 rounded-2xl shadow-sm border border-blue-400/40 gap-4">
      <div>
        <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck size={16} className="text-blue-800" />
          <span>Admin Command Center</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-950 font-normal">{todayFormatted}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
          <span>Welcome back, {user?.name || "Administrator"}</span>
          <Sparkles size={22} className="text-amber-500 hidden sm:inline" />
        </h1>
        <p className="text-slate-700 text-xs sm:text-sm mt-0.5 max-w-2xl">
          Overview of university events, student enrollment, campus notices, and academic support inquiries.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          to="/manageEvents"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <CalendarPlus size={14} />
          <span>Add Event</span>
        </Link>
        <Link
          to="/manageFaqs"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <HelpCircle size={14} />
          <span>Add FAQ</span>
        </Link>
        <Link
          to="/users"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Users size={14} />
          <span>Manage Users</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardHero;

