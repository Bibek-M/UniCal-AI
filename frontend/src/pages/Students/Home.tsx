import HomeHeader from "../../components/StudentComponents/Homepage/HomeHeader";
import AIAssistant from "../../components/StudentComponents/Homepage/AIAssistant";
import QuickLinks from "../../components/StudentComponents/Homepage/QuickLinks";
import HomeCalendar from "../../components/StudentComponents/Homepage/HomeCalendar";
import NavBar from "../../components/StudentComponents/NavBar";
import StayInformed from "../../components/StudentComponents/StayInformed";
import { useEvents } from "../../hooks/useEvents";
import Quote from "../../components/StudentComponents/Homepage/Quote";

const Home = () => {
  const { events } = useEvents();

  return (
    <div className="bg-slate-100 min-h-screen lg:h-screen lg:overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="shrink-0 z-30">
        <HomeHeader />
      </div>

      {/* Main Responsive 3-Column Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden">
        {/* Left Column: Navigation Bar */}
        <aside className="w-full lg:w-52 xl:w-60 shrink-0 bg-blue-100 lg:h-full lg:overflow-y-auto border-r border-slate-200/80">
          <NavBar />
        </aside>

        {/* Center Column: Campus Banner + Calendar (Fitted to viewport height on desktop) */}
        <main className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col gap-3 lg:overflow-hidden">
          <StayInformed />
          <div className="flex-1 min-h-[380px] lg:min-h-0 min-w-0">
            <HomeCalendar events={events} />
          </div>
        </main>

        {/* Right Column: AI Assistant + Quick Links */}
        <section className="w-full lg:w-76 xl:w-84 shrink-0 p-3 sm:p-4 flex flex-col gap-3 lg:overflow-y-auto">
          <AIAssistant />
          <QuickLinks />
          <Quote/>
        </section>
      </div>
    </div>
  );
};

export default Home;
