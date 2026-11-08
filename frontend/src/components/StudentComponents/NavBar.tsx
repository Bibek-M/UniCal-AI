import { Link, useNavigate } from "react-router-dom";
import NavInstitute from './NavInstitute';
import NavQuote from './NavQuote';
import { Calendar, House, ChartNoAxesGantt, Bookmark, Settings, Bot, CircleQuestionMark, LogOut } from "lucide-react";
import { clearAuth } from "../../utils/auth";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="flex flex-col bg-blue-100 h-full">
      <Link to="/home" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><House /></div>
        <div>Home</div>
      </Link>
      <Link to="/calendar" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><Calendar /></div>
        <div>Calendar</div>
      </Link>
      <Link to="/events" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><ChartNoAxesGantt /></div>
        <div>Events</div>
      </Link>
      {/* <Link to="/announcements" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><Megaphone /></div>
        <div>Announcements</div>
      </Link> */}
      <Link to="/mySchedule" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><Bookmark /></div>
        <div>My Schedule</div>
      </Link>
      <Link to="/AiAssistant" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><Bot /></div>
        <div>AI Assistant</div>
      </Link>
      <Link to="/settings" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><Settings /></div>
        <div>Settings</div>
      </Link>
      <Link to="/help" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl">
        <div><CircleQuestionMark /></div>
        <div>FAQs</div>
      </Link>
      <button
        onClick={handleLogout}
        className="flex gap-3 p-3 pl-4 hover:bg-red-100 hover:text-red-700 hover:rounded-2xl text-left cursor-pointer transition-colors"
      >
        <div><LogOut size={20} /></div>
        <div>Sign Out</div>
      </button>
      <NavInstitute />
      <NavQuote />
    </div>
  );
};

export default NavBar;
