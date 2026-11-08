import React from "react";
import { GraduationCap, Shield } from "lucide-react";
import type { SignUpRole } from "./types";

interface SignUpRoleToggleProps {
  role: SignUpRole;
  onRoleChange: (role: SignUpRole) => void;
  disabled?: boolean;
}

const SignUpRoleToggle: React.FC<SignUpRoleToggleProps> = ({
  role,
  onRoleChange,
  disabled = false,
}) => {
  return (
    <div className="mb-2.5 sm:mb-3 p-1 bg-slate-100 rounded-xl flex items-center border border-slate-200/80 shadow-2xs">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onRoleChange("Student")}
        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
          role === "Student"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <GraduationCap size={15} />
        <span>Student</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onRoleChange("Admin")}
        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
          role === "Admin"
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Shield size={15} />
        <span>Admin</span>
      </button>
    </div>
  );
};

export default SignUpRoleToggle;
