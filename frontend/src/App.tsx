import { Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import PageNotFound from "./pages/PageNotFound";
import StudentSignIn from "./pages/StudentSignIn";
import AdminSignin from "./pages/AdminSignin";
import AIAssistantPage from "./pages/AIAssistantPage";
import CalendarPage from "./pages/CalenderPage";
import AdminPage from "./pages/AdminPage";
const App = () => {
  return (
    <div className="w-screen">
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<StudentSignIn />} />
        <Route path="/signinadmin" element={<AdminSignin />} />
        <Route path="/aiAssistant" element={<AIAssistantPage />} />        
        <Route path="/calendar" element={<CalendarPage />} />        
        <Route path="/adminPage" element={<AdminPage />} />        
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App