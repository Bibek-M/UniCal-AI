import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Students/Home";
import PageNotFound from "./pages/PageNotFound";
import StudentSignIn from "./pages/Students/StudentSignIn";
import AdminSignin from "./pages/Admin/AdminSignin";
import AIAssistantPage from "./pages/Students/AIAssistantPage";
import CalendarPage from "./pages/Students/CalenderPage";
import AdminPage from "./pages/Admin/AdminPage";
import Users from "./pages/Admin/Users";
import FaqsPage from "./pages/Students/FaqsPage";
import MySchedule from "./pages/Students/MySchedule";
import EventsPage from "./pages/Students/EventsPage";
import StudentSettings from "./pages/Students/StudentSettings";
import ManageEvents from "./pages/Admin/ManageEvents";
import ManageFaq from "./pages/Admin/ManageFaq";
import SettingsAdmin from "./pages/Admin/SettingsAdmin";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { isAuthenticated, isAdmin } from "./utils/auth";

const App = () => {
  return (
    <div className="w-screen">
      <Routes>
        {/* Default route redirect */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              isAdmin() ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Public Authentication Pages */}
        <Route path="/signin" element={<StudentSignIn />} />
        <Route path="/signinAdmin" element={<AdminSignin />} />

        {/* Protected Student Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aiAssistant"
          element={
            <ProtectedRoute>
              <AIAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mySchedule"
          element={
            <ProtectedRoute>
              <MySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-schedule"
          element={
            <ProtectedRoute>
              <MySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <FaqsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="Admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roleRequired="Admin">
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageEvents"
          element={
            <ProtectedRoute roleRequired="Admin">
              <ManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manageFaqs"
          element={
            <ProtectedRoute roleRequired="Admin">
              <ManageFaq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageFaqs"
          element={
            <ProtectedRoute roleRequired="Admin">
              <ManageFaq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settingsAdmin"
          element={
            <ProtectedRoute roleRequired="Admin">
              <SettingsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              {isAdmin() ? <SettingsAdmin /> : <StudentSettings />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-settings"
          element={
            <ProtectedRoute>
              <StudentSettings />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;