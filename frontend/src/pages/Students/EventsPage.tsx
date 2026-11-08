import { useState } from "react";
import HomeHeader from "../../components/StudentComponents/Homepage/HomeHeader";
import NavBar from "../../components/StudentComponents/NavBar";
import EventsHero from "../../components/StudentComponents/EventsPage/EventsHero";
import EventsStats from "../../components/StudentComponents/EventsPage/EventsStats";
import EventsList from "../../components/StudentComponents/EventsPage/EventsList";
import { useEvents } from "../../hooks/useEvents";
import { CheckCircle2, AlertCircle } from "lucide-react";

const EventsPage = () => {
  const { events, loading } = useEvents();
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Calculate upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCount = events.filter((e) => {
    if (!e.date) return false;
    const parts = e.date.split("-");
    if (parts.length === 3) {
      const eventDate =
        parts[0].length === 2 && parts[2].length === 4
          ? new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
          : new Date(e.date);
      return !isNaN(eventDate.getTime()) && eventDate >= today;
    }
    return true;
  }).length;

  const handleToast = (msg: { type: "success" | "error"; text: string }) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
          {/* Action Toast Feedback */}
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
          <EventsHero
            totalCount={events.length}
            upcomingCount={upcomingCount}
          />

          {/* Quick Metrics */}
          {events.length > 0 && <EventsStats events={events} />}

          {/* Events Content Feed */}
          <EventsList
            events={events}
            loading={loading}
            onToast={handleToast}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

