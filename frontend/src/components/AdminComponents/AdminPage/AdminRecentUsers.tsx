import React from "react";
import { Link } from "react-router-dom";
import { Users, ArrowRight, UserCheck } from "lucide-react";

export interface UserElement {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
  role: "Student" | "Faculty" | "TPO" | "Admin";
  joinedOn: string;
}

interface AdminRecentUsersProps {
  users: UserElement[];
  loading: boolean;
}

const ROLE_BADGES: Record<string, string> = {
  Student: "bg-blue-50 text-blue-700 border-blue-200",
  Faculty: "bg-purple-50 text-purple-700 border-purple-200",
  TPO: "bg-amber-50 text-amber-700 border-amber-200",
  Admin: "bg-red-50 text-red-700 border-red-200",
};

const AdminRecentUsers: React.FC<AdminRecentUsersProps> = ({ users, loading }) => {
  // Show the latest 5 users
  const recentUsers = users.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-emerald-600" />
              <span>Recent Registrations</span>
            </h2>
            <p className="text-2xs text-slate-500">
              Students and faculty newly registered to the Unical AI portal.
            </p>
          </div>
          <Link
            to="/users"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>View directory</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading users...
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-slate-50 rounded-full text-slate-400">
              <UserCheck size={24} />
            </div>
            <p className="text-xs text-slate-500">No registered users yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentUsers.map((u) => {
              const initial = u.name ? u.name.charAt(0).toUpperCase() : "U";
              return (
                <div
                  key={u._id}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 text-xs truncate">
                        {u.name}
                      </div>
                      <div className="text-2xs text-slate-400 truncate">
                        {u.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-2xs font-semibold text-slate-700">
                        {u.department || "General"}
                      </div>
                      {u.rollNumber && (
                        <div className="text-3xs text-slate-400 font-mono">
                          {u.rollNumber}
                        </div>
                      )}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-3xs font-bold border uppercase tracking-wider ${
                        ROLE_BADGES[u.role] || "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
        <span>Showing {recentUsers.length} of {users.length} members</span>
        <Link to="/users" className="font-semibold text-blue-600 hover:underline">
          View all registered users
        </Link>
      </div>
    </div>
  );
};

export default AdminRecentUsers;

