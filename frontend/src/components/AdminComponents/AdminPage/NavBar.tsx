import { Calendar, House, Megaphone, Settings, CircleQuestionMark } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { Link } from "react-router-dom";
import NavInstitute from "../NavInstitute";
const NavBar = () => {
  return (
     <div className="flex flex-col text-white pt-5">
      <Link to="/admin" className="flex gap-3 p-3 pl-4  hover:bg-blue-600 hover:text-white hover:rounded-2xl "> <div><House/> </div> <div>Dashboard</div></Link>
      <Link to="/users"className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl items-center"><div><BsPeople size={27}/> </div> <div>Users</div></Link>
      <Link to="/manageEvents" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl "><div><Calendar/> </div> <div>manage Calendar</div> </Link>
      <Link to="/manageAnnouncements" className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl " ><div><Megaphone/> </div> <div>Manage announcements</div></Link>
      <Link to="/manageFaqs"className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl "><div><CircleQuestionMark/> </div> <div>Manage FAQs</div></Link>
      <Link to="/settingsAdmin"className="flex gap-3 p-3 pl-4 hover:bg-blue-600 hover:text-white hover:rounded-2xl "><div><Settings/> </div> <div>Settings</div></Link>
      <div className="pt-40">
      <NavInstitute/>
      </div>
    </div>
  )
}

export default NavBar