import React from "react";
import { Bot, Zap, Trash2, Calendar, ShieldCheck } from "lucide-react";
import { getUser, type AuthUser } from "../../../utils/auth";

interface AssistantCardProps {
  onClearChat?: () => void;
  messageCount?: number;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ onClearChat, messageCount = 0 }) => {
  const currentUser: AuthUser | null = getUser();
  const studentName = currentUser?.name || "Student";
  const branch = currentUser?.department || "CSE";
  const semester = currentUser?.semester || "1";

  return (
    <div className="bg-gradient-to-r from-blue-300 via-indigo-200 to-sky-200 px-5 py-4 rounded-2xl shadow-xs border border-blue-200/80 mb-3 relative overflow-hidden shrink-0">
      {/* Subtle ambient lighting */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-xs ring-2 ring-white/60">
            <Bot size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Unical AI Companion
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 shadow-2xs">
                <Zap size={10} /> Groq RAG
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Hello, <strong className="text-slate-900">{studentName}</strong> • Live answers for{" "}
              <strong className="text-blue-800">{branch} (Sem {semester})</strong>
            </p>
          </div>
        </div>

        {/* Status badges & Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 border border-blue-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Database Grounded</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 border border-blue-200/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
            <Calendar size={13} className="text-blue-600" />
            <span>Today: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>

          {messageCount > 0 && onClearChat && (
            <button
              type="button"
              onClick={onClearChat}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-red-700 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Reset conversation"
            >
              <Trash2 size={13} />
              <span>Clear Chat</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssistantCard;
