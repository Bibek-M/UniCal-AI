import { apiUrl } from "../../../api";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Hash,
  Building2,
  Lock,
  ShieldCheck,
  Info,
  Calendar,
} from "lucide-react";
import { getUser, getToken, getAuthHeaders, setAuth, type AuthUser } from "../../../utils/auth";

interface StudentPersonalDetailsProps {
  onProfileSynced?: (user: AuthUser) => void;
}

const StudentPersonalDetails: React.FC<StudentPersonalDetailsProps> = ({ onProfileSynced }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getUser());

  // Sync fresh profile from server once on mount
  useEffect(() => {
    let isMounted = true;

    const fetchFreshProfile = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/users/me"), {
          headers: {
            ...getAuthHeaders(),
          },
        });

        if (res.ok && isMounted) {
          const freshData = await res.json();
          const mappedUser: AuthUser = {
            id: freshData._id || freshData.id,
            username: freshData.username || "",
            name: freshData.name || "Student",
            email: freshData.email || "",
            role: freshData.role || "Student",
            department: freshData.department || "",
            semester: freshData.semester || "",
            rollNumber: freshData.rollNumber || "",
          };

          setCurrentUser(mappedUser);
          setAuth(token, mappedUser);
          if (onProfileSynced) {
            onProfileSynced(mappedUser);
          }
        }
      } catch (err) {
        console.warn("Could not sync fresh profile from server:", err);
      }
    };

    fetchFreshProfile();

    return () => {
      isMounted = false;
    };
  }, []); // Run only once on mount

  const name = currentUser?.name || "Student";
  const initial = name.charAt(0).toUpperCase();
  const rollNumber = currentUser?.rollNumber || "Not Assigned";
  const department = currentUser?.department || "General";
  const semester = currentUser?.semester || "1";
  const email = currentUser?.email || "student@unical.edu";
  const username = currentUser?.username || "student";

  // Format semester nicely: "6" -> "6th Semester", "6th Sem" -> "6th Semester"
  let formattedSemester = semester;
  const num = parseInt(semester, 10);
  if (!isNaN(num)) {
    const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
    formattedSemester = `${num}${suffix} Semester`;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/90 flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 h-12 w-12 items-center justify-center text-white font-extrabold text-lg shadow-sm ring-2 ring-white">
              {initial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">{name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck size={11} /> Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Roll No: <span className="font-semibold text-slate-700">{rollNumber}</span> • {department}
            </p>
          </div>
        </div>

        {/* Read-only Security Lock Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200/80 self-start sm:self-center">
          <Lock size={13} className="text-slate-500" />
          <span>Academic Profile (Read-Only)</span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Official Record Notice:</strong> Personal credentials such as your{" "}
          <strong>Name</strong>, <strong>Registration / Roll Number</strong>, <strong>Branch</strong>, and{" "}
          <strong>Semester</strong> are officially locked. These details cannot be edited here. To update or correct your records, please contact the administration office below.
        </p>
      </div>

      {/* Grid of Read-Only Fields */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Full Name */}
        <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 relative group">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-blue-600" /> Full Name
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-200/70 px-1.5 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">{name || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-1">As per admission enrollment records</div>
        </div>

        {/* Roll / Registration Number */}
        <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 relative group">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <Hash size={13} className="text-indigo-600" /> Registration / Roll No.
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-200/70 px-1.5 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 font-mono">{rollNumber || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-1">Permanent student enrollment identifier</div>
        </div>

        {/* Institutional Email */}
        <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 relative group">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-emerald-600" /> University Email
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-200/70 px-1.5 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">{email || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-1">Used for official circular broadcasts</div>
        </div>

        {/* Department / Branch */}
        <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 relative group">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <Building2 size={13} className="text-amber-600" /> Department / Branch
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-200/70 px-1.5 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">{department || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-1">Academic degree discipline</div>
        </div>

        {/* Current Semester */}
        <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 relative group">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <GraduationCap size={13} className="text-purple-600" /> Current Semester
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-200/70 px-1.5 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800">{formattedSemester || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-1">Updated at end-semester progression</div>
        </div>

        {/* Username / Portal Account */}
        <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 relative group">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-rose-600" /> Portal Username
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-200/70 px-1.5 py-0.5 rounded">
              <Lock size={10} /> Locked
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 font-mono">{username || "—"}</div>
          <div className="text-[10px] text-slate-400 mt-1">Single sign-on portal handle</div>
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalDetails;
