import { CalendarPlus } from "lucide-react";

const ManageEventsHero = () => {
  return (
    <div className="flex justify-between items-center bg-blue-300 px-6 py-5 rounded-2xl shadow-sm border border-blue-400/30">
      <div>
        <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm uppercase tracking-wide">
          <CalendarPlus size={18} />
          <span>Events Management</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Manage University Events
        </h1>
        <p className="text-slate-700 text-sm mt-0.5">
          Publish, organize and manage academic schedules, holidays, seminars, or deadlines directly for students.
        </p>
      </div>
    </div>
  );
};

export default ManageEventsHero;
