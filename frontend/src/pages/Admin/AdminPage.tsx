import { useState, useEffect } from "react";
import AppLogo from "../../components/AdminComponents/AdminPage/AppLogo";
import NavBar from "../../components/AdminComponents/AdminPage/NavBar";
import AdminHeader from "../../components/AdminComponents/AdminPage/AdminHeader";
import AdminDashboardHero from "../../components/AdminComponents/AdminPage/AdminDashboardHero";
import AdminStatCards from "../../components/AdminComponents/AdminPage/AdminStatCards";
import AdminUpcomingEvents from "../../components/AdminComponents/AdminPage/AdminUpcomingEvents";
import AdminRecentUsers from "../../components/AdminComponents/AdminPage/AdminRecentUsers";
import AdminActivitySummary from "../../components/AdminComponents/AdminPage/AdminActivitySummary";
import { getAuthHeaders } from "../../utils/auth";
import type { CalendarEvent } from "../../types/calendar";
import type { UserElement } from "../../components/AdminComponents/AdminPage/AdminRecentUsers";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

const AdminPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<UserElement[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();

        const [eventsRes, usersRes, faqsRes] = await Promise.allSettled([
          fetch("http://localhost:3000/api/events"),
          fetch("http://localhost:3000/api/users", { headers }),
          fetch("http://localhost:3000/api/faqs"),
        ]);

        if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
          const eventsData = await eventsRes.value.json();
          setEvents(Array.isArray(eventsData) ? eventsData : []);
        }

        if (usersRes.status === "fulfilled" && usersRes.value.ok) {
          const usersData = await usersRes.value.json();
          setUsers(Array.isArray(usersData) ? usersData : []);
        }

        if (faqsRes.status === "fulfilled" && faqsRes.value.ok) {
          const faqsData = await faqsRes.value.json();
          setFaqs(Array.isArray(faqsData) ? faqsData : []);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const importantEvents = events.filter((e) => e.isImportant).length;
  const studentCount = users.filter((u) => u.role === "Student").length;
  const facultyCount = users.filter((u) => u.role === "Faculty" || u.role === "TPO").length;

  return (
    <div className="w-screen flex">
      <div className="w-2/11 bg-gray-800 px-5 h-screen py-5 shrink-0">
        <AppLogo />
        <NavBar />
      </div>
      <div className="w-9/11 bg-blue-200 h-screen overflow-y-auto">
        <div className="pl-5 pr-5 pt-3 rounded-2xl max-w-screen flex flex-col gap-5 pb-10">
          <AdminHeader />
          <AdminDashboardHero />
          <AdminStatCards
            totalEvents={events.length}
            importantEvents={importantEvents}
            totalUsers={users.length}
            studentCount={studentCount}
            facultyCount={facultyCount}
            totalFaqs={faqs.length}
            loading={loading}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AdminUpcomingEvents events={events} loading={loading} />
            <AdminRecentUsers users={users} loading={loading} />
          </div>
          <AdminActivitySummary events={events} faqsCount={faqs.length} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
