import { Route, Routes } from "react-router-dom";
import Home from './pages/Students/Home'
import PageNotFound from "./pages/PageNotFound";
import StudentSignIn from "./pages/Students/StudentSignIn";
import AdminSignin from "./pages/Admin/AdminSignin";
import AIAssistantPage from "./pages/Students/AIAssistantPage";
import CalendarPage from "./pages/Students/CalenderPage";
import AdminPage from "./pages/Admin/AdminPage";
import Users from "./pages/Admin/Users";
import SettingsAdmin from "./pages/Admin/SettingsAdmin";
import ManageFaq from "./pages/Admin/ManageFaq";
import ManageEvents from "./pages/Admin/ManageEvents";
import ManageAnnouncements from "./pages/Admin/ManageAnnouncements";
// import Tempo from "./pages/tempo/users"
const App = () => {
  return (
    <div className="w-screen">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<StudentSignIn />} />
        <Route path="/signinAdmin" element={<AdminSignin />} />
        <Route path="/aiAssistant" element={<AIAssistantPage />} />        
        <Route path="/calendar" element={<CalendarPage />} />        
        <Route path="/admin" element={<AdminPage />} />        
        <Route path="/users" element={<Users />} />             
        <Route path="/manageEvents" element={<ManageEvents/>} />             
        <Route path="/manageAnnouncements" element={<ManageAnnouncements />} />             
        <Route path="/manageFaqs" element={<ManageFaq />} />             
        <Route path="/settingsAdmin" element={<SettingsAdmin />} />    
        {/* <Route path="/tempo" element={<Tempo/>} /> */}
                 
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App