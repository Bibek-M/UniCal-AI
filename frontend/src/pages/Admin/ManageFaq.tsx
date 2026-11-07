import { useState } from "react";
import AppLogo from "../../components/AdminComponents/AdminPage/AppLogo";
import NavBar from "../../components/AdminComponents/AdminPage/NavBar";
import ManageFaqHero from "../../components/AdminComponents/ManageFaq/manageFaqHero";
import AddFaq from "../../components/AdminComponents/ManageFaq/AddFaq";
import PreviousFaq from "../../components/AdminComponents/ManageFaq/previousFaq";

const ManageFaq = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  return (
    <div className="w-screen flex">
      <div className="w-2/11 bg-gray-800 px-5 h-screen py-5">
        <AppLogo />
        <NavBar />
      </div>
      <div className="w-9/11 bg-blue-200 h-screen overflow-y-auto">
        <div className="pl-5 pr-5 pt-5 rounded-2xl max-w-screen flex flex-col gap-5 pb-10">
          <ManageFaqHero />
          <AddFaq onFaqAdded={() => setRefreshKey((k) => k + 1)} />
          <PreviousFaq refreshTrigger={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default ManageFaq;