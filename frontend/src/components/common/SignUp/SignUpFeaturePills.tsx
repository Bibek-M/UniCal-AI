import React from "react";
import { Calendar, Megaphone, UserRoundGroup, Trophy } from "lucide-react";

interface FeaturePillProps {
  icon: React.ReactNode;
  label: string;
}

const FeaturePill: React.FC<FeaturePillProps> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1 p-0.5">
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-2xs">
      {icon}
    </div>
    <p className="text-[9px] sm:text-[10px] leading-tight font-bold text-slate-700">
      {label}
    </p>
  </div>
);

const SignUpFeaturePills: React.FC = () => {
  return (
    <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-lg grid grid-cols-4 gap-1.5 text-center text-xs font-bold border border-white/80">
      {/* 1. Exam & Timetable */}
      <FeaturePill
        icon={
          <div className="w-full h-full rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Calendar size={16} />
          </div>
        }
        label="Exam & Timetable"
      />

      {/* 2. Announcements & Notices */}
      <FeaturePill
        icon={
          <div className="w-full h-full rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Megaphone size={16} />
          </div>
        }
        label="Announcements & Notices"
      />

      {/* 3. Events & Workshops */}
      <FeaturePill
        icon={
          <div className="w-full h-full rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UserRoundGroup size={16} />
          </div>
        }
        label="Events & Workshops"
      />

      {/* 4. Placements & Opportunities */}
      <FeaturePill
        icon={
          <div className="w-full h-full rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Trophy size={16} />
          </div>
        }
        label="Placements & Opportunities"
      />
    </div>
  );
};

export default SignUpFeaturePills;
