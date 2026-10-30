import { Link } from "react-router-dom";
import NavInstitute from './NavInstitute';
import NavQuote from './NavQuote'
import { Calendar, House, ChartNoAxesGantt, Megaphone, Bookmark, Settings, Bot, CircleQuestionMark } from "lucide-react";
// import HomeHeader from "./HomeHeader";
const NavBar = () => {
  return (
    <div className="flex flex-col bg-blue-100 h-full">
      <Link to="/home" className="flex gap-3 p-3 pl-4  hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "> <div><House/> </div> <div>Home</div></Link>
      <Link to="/calender" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "><div><Calendar/> </div> <div>Calendar</div> </Link>
      <Link to="/events"className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "><div><ChartNoAxesGantt/> </div> <div>Events</div></Link>
      <Link to="/announcements" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl " ><div><Megaphone/> </div> <div>announcements</div></Link>
      <Link to="/mySchedule" className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "><div><Bookmark/> </div> <div>My Schedule</div></Link>
      <Link to="/AiAssistant"className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "><div><Bot/> </div> <div>AI Assistant</div></Link>
      <Link to="/settings"className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "><div><Settings/> </div> <div>Settings</div></Link>
      <Link to="/help"className="flex gap-3 p-3 pl-4 hover:bg-blue-200 hover:text-blue-700 hover:rounded-2xl "><div><CircleQuestionMark/> </div> <div>Help</div></Link>
      <NavInstitute/>
      <NavQuote/>
    </div>
  );
}

export default NavBar