import { useState } from "react";
import AppLogo from "../../components/AdminComponents/AdminPage/AppLogo";
import NavBar from "../../components/AdminComponents/AdminPage/NavBar";
import AdminHeader from "../../components/AdminComponents/AdminPage/AdminHeader";
import SettingsHero from "../../components/AdminComponents/SettingsPage/SettingsHero";
import AdminPersonalDetails from "../../components/AdminComponents/SettingsPage/AdminPersonalDetails";
import GoogleIntegrationCard from "../../components/AdminComponents/SettingsPage/GoogleIntegrationCard";
import AdminPreferences from "../../components/AdminComponents/SettingsPage/AdminPreferences";
import type { AuthUser } from "../../utils/auth";

const SettingsAdmin = () => {
  const [, setProfileKey] = useState<number>(0);

  const handleProfileUpdated = (_updated: AuthUser) => {
    // Re-render header & profile badge when personal details update
    setProfileKey((k) => k + 1);
  };

  return (
    <div className="w-screen flex">
      {/* Sidebar */}
      <div className="w-2/11 bg-gray-800 px-5 h-screen py-5 shrink-0">
        <AppLogo />
        <NavBar />
      </div>

      {/* Main Content Area */}
      <div className="w-9/11 bg-blue-200 h-screen overflow-y-auto">
        <div className="pl-5 pr-5 pt-3 rounded-2xl max-w-screen flex flex-col gap-5 pb-12">
          {/* Header */}
          <AdminHeader />

          {/* Hero Section */}
          <SettingsHero />

          {/* Personal Details at Top with Option to Edit */}
          <AdminPersonalDetails onProfileUpdated={handleProfileUpdated} />

          {/* Connect with Google Integration Toggle */}
          <GoogleIntegrationCard />

          {/* Additional Preferences & Security */}
          <AdminPreferences />
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;

