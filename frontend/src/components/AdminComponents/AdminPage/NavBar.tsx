import { House, Megaphone, Settings, CircleQuestionMark, LogOut } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import NavInstitute from "../NavInstitute";
import { clearAuth } from "../../../utils/auth";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/signinAdmin", { replace: true });
  };

  return (
    <div className="flex flex-col text-white pt-5">
      <Link to="/admin" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl">
        <div><House /></div>
        <div>Dashboard</div>
      </Link>
      <Link to="/users" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl items-center">
        <div><BsPeople size={27} /></div>
        <div>Users</div>
      </Link>
      <Link to="/manageEvents" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl">
        <div><Megaphone /></div>
        <div>Manage Events</div>
      </Link>
      <Link to="/manageFaqs" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl">
        <div><CircleQuestionMark /></div>
        <div>Manage FAQs</div>
      </Link>
      <Link to="/settingsAdmin" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl">
        <div><Settings /></div>
        <div>Settings</div>
      </Link>
      <button
        onClick={handleLogout}
        className="flex gap-3 p-3 pl-4 hover:bg-red-600 hover:text-white hover:rounded-2xl text-left cursor-pointer transition-colors"
      >
        <div><LogOut size={22} /></div>
        <div>Sign Out</div>
      </button>
      <div className="pt-24">
        <NavInstitute />
      </div>
    </div>
  );
};

export default NavBar;