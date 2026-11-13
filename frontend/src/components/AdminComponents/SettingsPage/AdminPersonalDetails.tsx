import { apiUrl } from "../../../api";
import React, { useState } from "react";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Pencil,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Calendar,
} from "lucide-react";
import { getUser, getToken, setAuth, getAuthHeaders } from "../../../utils/auth";
import type { AuthUser } from "../../../utils/auth";

interface AdminPersonalDetailsProps {
  onProfileUpdated?: (updated: AuthUser) => void;
}

const AdminPersonalDetails: React.FC<AdminPersonalDetailsProps> = ({ onProfileUpdated }) => {
  const currentUser = getUser();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields state
  const [name, setName] = useState<string>(currentUser?.name || "");
  const [email, setEmail] = useState<string>(currentUser?.email || "");
  const [username, setUsername] = useState<string>(currentUser?.username || "");
  const [department, setDepartment] = useState<string>(currentUser?.department || "Academic Affairs");

  const initial = (currentUser?.name || "Admin").charAt(0).toUpperCase();

  const handleStartEdit = () => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setUsername(currentUser?.username || "");
    setDepartment(currentUser?.department || "Academic Affairs");
    setIsEditing(true);
    setToast(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setToast(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!name.trim() || !email.trim()) {
      setToast({ type: "error", text: "Full name and email cannot be empty." });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const userId = currentUser?.id;

      if (!userId || !token) {
        throw new Error("User session expired. Please sign in again.");
      }

      const res = await fetch(apiUrl(`/api/users/${userId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          department: department.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile details.");
      }

      // Update stored auth user
      const updatedUser: AuthUser = {
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
        username: username.trim() || currentUser.username,
        department: department.trim(),
      };

      setAuth(token, updatedUser);
      setIsEditing(false);
      setToast({ type: "success", text: "Personal details updated successfully!" });

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setToast({ type: "error", text: err.message || "Something went wrong saving changes." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`mb-5 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <AlertCircle size={16} className="text-red-600" />
            )}
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-2xs underline hover:opacity-75 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User size={19} className="text-blue-600" />
            <span>Administrator Personal Details</span>
          </h2>
          <p className="text-xs text-slate-500">
            View and manage your core identity, contact details, and institutional department.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleStartEdit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs border border-blue-200 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Pencil size={13} />
            <span>Edit Details</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium text-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <X size={13} />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {/* Profile Overview (Non-editing view) */}
      {!isEditing ? (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Active Account">
                <ShieldCheck size={14} />
              </div>
            </div>
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
              Verified Admin
            </span>
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Full Name
              </span>
              <div className="font-bold text-slate-900 text-sm truncate">
                {currentUser?.name || "Administrator"}
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Email Address
              </span>
              <div className="font-semibold text-slate-800 text-xs truncate flex items-center gap-1.5">
                <Mail size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{currentUser?.email || "admin@unical.edu"}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Username
              </span>
              <div className="font-mono font-bold text-slate-800 text-xs truncate flex items-center gap-1.5">
                <KeyRound size={12} className="text-slate-400 shrink-0" />
                <span>@{currentUser?.username || "admin"}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Department
              </span>
              <div className="font-semibold text-slate-800 text-xs truncate flex items-center gap-1.5">
                <Building2 size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{currentUser?.department || "Academic Affairs"}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form Mode */
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="font-semibold text-slate-700 mb-1.5 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. John Doe"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="font-semibold text-slate-700 mb-1.5 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unical.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
                required
              />
            </div>

            {/* Username (Read-only identifier) */}
            <div>
              <label className="font-semibold text-slate-700 mb-1.5 block">
                Username (System Identifier)
              </label>
              <input
                type="text"
                value={username}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-500 cursor-not-allowed outline-none"
              />
              <span className="text-3xs text-slate-400 mt-1 block">
                Username is permanently bound to account login credentials.
              </span>
            </div>

            {/* Department */}
            <div>
              <label className="font-semibold text-slate-700 mb-1.5 block">
                Department / Division
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save size={13} />
              <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Meta footnote */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-2xs text-slate-400 gap-2">
        <span className="flex items-center gap-1.5">
          <Calendar size={12} className="text-slate-400" />
          <span>Member Role: <strong className="text-slate-700 font-bold uppercase">{currentUser?.role || "ADMIN"}</strong></span>
        </span>
        <span className="font-mono text-3xs text-slate-400">
          Account ID: {currentUser?.id || "6725354911f9..."}
        </span>
      </div>
    </div>
  );
};

export default AdminPersonalDetails;
