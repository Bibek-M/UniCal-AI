import { useState, useCallback } from "react";
import HomeHeader from "../../components/StudentComponents/Homepage/HomeHeader";
import NavBar from "../../components/StudentComponents/NavBar";
import SettingsHero from "../../components/StudentComponents/SettingsPage/SettingsHero";
import StudentPersonalDetails from "../../components/StudentComponents/SettingsPage/StudentPersonalDetails";
import StudentNotificationPreferences from "../../components/StudentComponents/SettingsPage/StudentNotificationPreferences";
import ContactAdminCard from "../../components/StudentComponents/SettingsPage/ContactAdminCard";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { AuthUser } from "../../utils/auth";
import { getUser } from "../../utils/auth";

const StudentSettings = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getUser());
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleProfileSynced = useCallback((user: AuthUser) => {
    setCurrentUser((prev) => {
      if (
        prev?.name === user.name &&
        prev?.email === user.email &&
        prev?.department === user.department &&
        prev?.semester === user.semester &&
        prev?.rollNumber === user.rollNumber &&
        prev?.username === user.username
      ) {
        return prev;
      }
      return user;
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      {/* Top Header */}
      <HomeHeader />

      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <div className="w-1/7 shrink-0 min-h-screen bg-blue-100">
          <NavBar />
        </div>

        {/* Main Content Area */}
        <div className="w-6/7 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* Toast Notification Alert */}
          {toastMessage && (
            <div
              className={`mb-4 flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold shadow-xs animate-fadeIn ${
                toastMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {toastMessage.type === "success" ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-red-600 shrink-0" />
              )}
              <span className="flex-1">{toastMessage.text}</span>
            </div>
          )}

          {/* Hero Banner */}
          <SettingsHero studentName={currentUser?.name} />

          {/* Settings Grid Content */}
          <div className="flex flex-col gap-6">
            {/* 1. Student Personal Details (Read-only Academic Records) */}
            <StudentPersonalDetails onProfileSynced={handleProfileSynced} />

            {/* 2. Notification Preferences (Editable by Student) */}
            <StudentNotificationPreferences
              onSaved={(msg) => showToast("success", msg)}
            />

            {/* 3. Official Contact Admin Notice & Card */}
            <ContactAdminCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;

