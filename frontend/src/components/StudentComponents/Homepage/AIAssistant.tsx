import { apiUrl } from "../../../api";
import { useState, useEffect } from "react";
import { Bot, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, getToken, getAuthHeaders, type AuthUser } from "../../../utils/auth";
import AISearch from "./AISearch";

function formatSemesterLabel(rawSem: string | number | undefined): { label: string; num: number } {
  if (!rawSem) return { label: "1st", num: 1 };
  const str = String(rawSem).trim();
  const num = parseInt(str.replace(/\D/g, ""), 10) || 1;
  const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
  return { label: `${num}${suffix}`, num };
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getUser());

  // Sync fresh profile if available
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(apiUrl("/api/users/me"), {
      headers: { ...getAuthHeaders() },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh) => {
        if (fresh) {
          setCurrentUser({
            id: fresh._id || fresh.id,
            username: fresh.username || "",
            name: fresh.name || "Student",
            email: fresh.email || "",
            role: fresh.role || "Student",
            department: fresh.department || "CSE",
            semester: fresh.semester || "1",
            rollNumber: fresh.rollNumber || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const branch = currentUser?.department || "CSE";
  const { label: semLabel, num: semNum } = formatSemesterLabel(currentUser?.semester);

  // Dynamic questions tailored to the student's specific branch and semester
  const tailoredQuestions = [
    {
      icon: "📅",
      category: "Exams",
      text: `When are the upcoming exam dates for ${branch} ${semLabel} sem?`,
    },
    {
      icon: "⏳",
      category: "Deadlines",
      text: `What are the project review and submission deadlines for ${branch} Sem ${semNum}?`,
    },
    {
      icon: "📜",
      category: "Circulars",
      text: `Show latest university notices for the ${branch} department.`,
    },
    {
      icon: "🏖️",
      category: "Calendar",
      text: "When is the next upcoming university holiday on the calendar?",
    },
  ];

  const handleQuestionClick = (query: string) => {
    navigate(`/aiAssistant?q=${encodeURIComponent(query)}`, {
      state: { initialQuery: query },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 mr-2.5 w-full">
      {/* Header with Bot Icon and Student Badge */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-xs ring-2 ring-blue-100">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                AI Assistant
              </h2>
             
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Instant answers about your department notices, exams, and deadlines.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Questions List */}
      <div className="space-y-2 mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1.5 flex items-center justify-between">
          <span>Suggested questions:</span>
          <span className="text-[10px] text-blue-600 font-semibold sm:hidden">{branch} • Sem {semNum}</span>
        </div>

        {tailoredQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuestionClick(q.text)}
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 rounded-xl text-left text-xs font-medium text-slate-700 hover:text-blue-700 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-sm shrink-0">{q.icon}</span>
              <span className="truncate group-hover:font-semibold transition-all">
                {q.text}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white group-hover:bg-blue-100/70 border border-slate-200 group-hover:border-blue-200 hidden md:inline-block">
                {q.category}
              </span>
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* AISearch Component at bottom */}
      <div className="pt-2 border-t border-slate-100">
        <AISearch />
      </div>
    </div>
  );
};

export default AIAssistant;
