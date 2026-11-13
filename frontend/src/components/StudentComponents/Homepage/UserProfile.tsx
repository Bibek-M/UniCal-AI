import { apiUrl } from "../../../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser, getAuthHeaders, setAuth, getToken, type AuthUser } from "../../../utils/auth";
import { ChevronDown } from "lucide-react";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getUser());

  useEffect(() => {
    const fetchFreshProfile = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/users/me"), {
          headers: {
            ...getAuthHeaders(),
          },
        });

        if (res.ok) {
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
        }
      } catch (err) {
        // Fall back gracefully to localStorage user
        console.warn("Could not sync fresh profile from server:", err);
      }
    };

    fetchFreshProfile();
  }, []);

  const name = currentUser?.name || "Student User";
  const initial = name.trim().charAt(0).toUpperCase() || "S";
  const branch = currentUser?.department || "CSE";

  // Format semester nicely: "7" -> "7th Sem", "7th Sem" -> "7th Sem"
  const rawSem = currentUser?.semester ? String(currentUser.semester).trim() : "";
  let formattedSem = "1st Sem";
  if (rawSem) {
    if (rawSem.toLowerCase().includes("sem")) {
      formattedSem = rawSem;
    } else {
      const num = parseInt(rawSem, 10);
      if (!isNaN(num)) {
        const suffix =
          num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
        formattedSem = `${num}${suffix} Sem`;
      } else {
        formattedSem = rawSem;
      }
    }
  }

  return (
    <Link
      to="/settings"
      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-slate-200 group cursor-pointer mr-4"
      title="View your settings and profile"
    >
      {/* Avatar Circle */}
      <div className="relative">
        <div className="flex rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 h-10 w-10 items-center justify-center text-white font-extrabold text-base shadow-sm ring-2 ring-white">
          {initial}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
      </div>

      {/* User Info */}
      <div className="text-left hidden sm:block">
        <div className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
          <span className="truncate max-w-[140px]">{name}</span>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-600 transition-transform" />
        </div>
        <div className="text-xs font-semibold text-slate-500 mt-0.5">
          <span className="text-blue-600 font-bold">{branch}</span>
          <span className="mx-1 text-slate-300">•</span>
          <span>{formattedSem}</span>
        </div>
      </div>
    </Link>
  );
};

export default UserProfile;
