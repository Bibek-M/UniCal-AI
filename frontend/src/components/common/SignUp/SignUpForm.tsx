import React, { useState } from "react";
import {
  Mail,
  User,
  Hash,
  AtSign,
  Building2,
  GraduationCap,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  type SignUpRole,
  STUDENT_DEPARTMENTS,
  ADMIN_DEPARTMENTS,
  STUDENT_SEMESTERS,
} from "./types";

interface SignUpFormProps {
  role: SignUpRole;
  name: string;
  setName: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  rollNumber: string;
  setRollNumber: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  semester: string;
  setSemester: (val: string) => void;
  adminKey: string;
  setAdminKey: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  role,
  name,
  setName,
  email,
  onEmailChange,
  username,
  setUsername,
  rollNumber,
  setRollNumber,
  department,
  setDepartment,
  semester,
  setSemester,
  adminKey,
  setAdminKey,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-2 sm:space-y-2.5">
      {/* Email Address */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-0.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail size={15} />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email address"
            className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-0.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User size={15} />
          </div>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Two Column Row: Registration Number / Staff ID & Username */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {/* Registration Number (Student) / Staff ID (Admin) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-0.5">
            {role === "Student" ? "Registration Number" : "Staff / Admin ID"}
            {role === "Student" && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Hash size={15} />
            </div>
            <input
              type="text"
              required={role === "Student"}
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder={role === "Student" ? "e.g. 2101289123" : "e.g. ADM-401"}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-0.5">
            Portal Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <AtSign size={15} />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose username"
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Two Column Row: Fixed Department & Fixed Semester Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {/* Department (Fixed Types Toggle/Dropdown) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-0.5">
            <span className="flex items-center gap-1">
              <Building2 size={13} className="text-blue-600" />
              <span>{role === "Student" ? "Branch" : "Admin Wing"}</span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {role === "Student"
              ? STUDENT_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))
              : ADMIN_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
          </select>
        </div>

        {/* Semester (Fixed Types Toggle/Dropdown) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-0.5">
            <span className="flex items-center gap-1">
              <GraduationCap size={13} className="text-indigo-600" />
              <span>{role === "Student" ? "Semester" : "Designation"}</span>
              <span className="text-red-500">*</span>
            </span>
          </label>
          {role === "Student" ? (
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {STUDENT_SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 sm:py-2 flex items-center justify-between">
              <span>Staff Administrator</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Authorization Key (Required only for Admin role) */}
      {role === "Admin" && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 space-y-1 transition-all">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <KeyRound size={13} className="text-amber-600" />
              <span>Admin Security Key</span>
              <span className="text-red-500">*</span>
            </label>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Admin Only
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
              <KeyRound size={15} />
            </div>
            <input
              type={showAdminKey ? "text" : "password"}
              required={role === "Admin"}
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter Admin Key (e.g. 123456)"
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-amber-200 rounded-xl pl-9 pr-9 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-400 transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowAdminKey(!showAdminKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showAdminKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Two Column Row: Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {/* Password */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-0.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={15} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-0.5">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={15} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
