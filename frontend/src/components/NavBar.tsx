import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex flex-col">
      <Link to="/home">Home</Link>
      <Link to="/calender">Calendar</Link>
      <Link to="/events">events</Link>
      <Link to="/announcements">announcements</Link>
      <Link to="/mySchedule">my Schedule</Link>
      <Link to="/AiAssistant">Ai Assistant</Link>
      <Link to="/settings">settings</Link>
      <Link to="/help">help</Link>
    </div>
  );
}

export default NavBar