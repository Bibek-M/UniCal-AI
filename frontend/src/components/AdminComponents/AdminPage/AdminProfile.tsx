import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, clearAuth } from "../../../utils/auth";

const AdminProfile = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/signinAdmin", { replace: true });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="flex gap-2.5 px-4 py-3 items-center">
      <div className="flex rounded-full bg-blue-700 h-9 w-9 items-center justify-center text-white font-extrabold shadow-sm text-sm">
        {initial}
      </div>
      <div>
        <div className="font-bold text-slate-800 text-xs leading-tight">
          {user?.name || "Administrator"}
        </div>
        <div className="text-2xs text-slate-500 font-medium">
          {user?.role || "Admin"} • {user?.department || "GIET"}
        </div>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        title="Logout"
        className="ml-2 p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
};

export default AdminProfile;