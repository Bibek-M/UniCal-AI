import AppLogo from "../../components/AdminComponents/AdminPage/AppLogo";
import NavBar from "../../components/AdminComponents/AdminPage/NavBar";
import AddEvents from "../../components/AdminComponents/ManageEvents/AddEvents";
import ManageEventsHero from "../../components/AdminComponents/ManageEvents/manageEventsHero";
import PreviousEvents from "../../components/AdminComponents/ManageEvents/previousEvents";

const ManageEvents = () => {
  return (
    <div className="w-screen flex">
      <div className="w-2/11 bg-gray-800 px-5 h-screen py-5">
        <AppLogo />
        <NavBar />
      </div>
      <div className="w-9/11 bg-blue-200 h-screen overflow-y-auto">
        <div className="pl-5 pr-5 pt-5 rounded-2xl max-w-screen flex flex-col gap-5 pb-10">
          <ManageEventsHero />
          <AddEvents />
          <PreviousEvents />
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;