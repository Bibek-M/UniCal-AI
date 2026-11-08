import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  BookmarkPlus,
  BookmarkCheck,
  AlertCircle,
  ExternalLink,
  Zap,
} from "lucide-react";
import { getUser, getAuthHeaders, type AuthUser } from "../../../utils/auth";
import { useSchedule } from "../../../hooks/useSchedule";
import { Link, useSearchParams } from "react-router-dom";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: {
    id?: number | string;
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    category?: string;
    department?: string;
  }[];
  modelUsed?: string;
}

const QUICK_PROMPTS = [
  {
    icon: "📅",
    label: "When is my next exam?",
    query: "When is my next exam? Please check upcoming academic timetable notices for my branch and semester.",
  },
  {
    icon: "⏳",
    label: "Upcoming deadlines",
    query: "What are the upcoming assignment or project review deadlines for my department?",
  },
  {
    icon: "📌",
    label: "My saved schedule",
    query: "What events and tasks do I have saved in my personal schedule?",
  },
  {
    icon: "🏖️",
    label: "Next university holiday",
    query: "When is the next upcoming university holiday or campus recess?",
  },
  {
    icon: "🏛️",
    label: "Campus events this month",
    query: "What seminars, workshops, or campus events are scheduled this month?",
  },
];

interface AIChatProps {
  onMessageCountChange?: (count: number) => void;
  clearTrigger?: number;
}

const AIChat: React.FC<AIChatProps> = ({ onMessageCountChange, clearTrigger }) => {
  const currentUser: AuthUser | null = getUser();
  const studentName = currentUser?.name || "Student";
  const branch = currentUser?.department || "CSE";
  const semester = currentUser?.semester || "1";

  const { addToSchedule, isScheduled } = useSchedule();

  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const initialQueryHandled = useRef<boolean>(false);

  // Initialize messages with a personalized welcome
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `Hello **${studentName}**! 👋 I'm your **Unical AI Companion**, powered by Groq Llama 3.\n\nI have direct access to verified university circulars, exam schedules, and department notices for **${branch} (${semester}th Semester)**.\n\nAsk me anything below, like **"When is my next exam?"**, or tap a suggested prompt to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (onMessageCountChange) {
      onMessageCountChange(messages.length);
    }
  }, [messages, loading, onMessageCountChange]);

  // Handle external clear trigger
  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: `Chat history cleared. How can I help you with your **${branch}** schedule or exam notices today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setErrorMsg(null);
    }
  }, [clearTrigger, branch]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setErrorMsg(null);
    setInput("");

    // Create user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = messages
        .filter((m) => m.id !== "welcome" && !m.id.startsWith("welcome-"))
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("http://localhost:3000/api/rag/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to receive reply from Unical AI.");
      }

      // Add assistant response
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I couldn't find specific details on that topic in the current notices.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || [],
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("[Chat Error]:", err);
      setErrorMsg(err.message || "An error occurred while communicating with the AI service.");
      // Add error message in thread
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ **Unable to fetch response:** ${err.message || "Please check that your backend server is running with the GROQ_API key."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPromptClick = (query: string) => {
    handleSendMessage(query);
  };

  // Automatically execute query if forwarded from Home search (?q=...)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      handleSendMessage(q);
    }
  }, [searchParams]);

  // Helper to render markdown-like formatting (bolding, newlines, lists)
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      // Parse **bold** parts
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-extrabold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <div key={lIdx} className="flex items-start gap-2 my-0.5 ml-2">
            <span className="text-blue-600 font-bold">•</span>
            <span className="flex-1">{renderedLine}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} className={line.trim() === "" ? "h-2" : "my-0.5 leading-relaxed"}>
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 flex flex-col h-full overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fadeIn`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
                    : "bg-gradient-to-tr from-slate-800 to-blue-900 text-white ring-2 ring-blue-100"
                }`}
              >
                {isUser ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Bubble Body */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-xs shadow-xs"
                    : "bg-slate-50/90 text-slate-700 border border-slate-200/70 rounded-tl-xs shadow-2xs"
                }`}
              >
                {/* Header label inside bubble */}
                <div
                  className={`flex items-center justify-between gap-3 pb-1 mb-1.5 border-b text-[10px] ${
                    isUser
                      ? "border-blue-500/60 text-blue-100"
                      : "border-slate-200 text-slate-400"
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    {isUser ? studentName : "Unical AI Companion"}
                    {!isUser && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-800 font-extrabold ml-1">
                        Groq
                      </span>
                    )}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Formatted Content */}
                <div className="text-xs break-words">
                  {renderFormattedContent(msg.content)}
                </div>

                {/* Event Source Citations if present */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-500" />
                      <span>Verified Event Matches from Database</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {msg.sources.map((src, sIdx) => {
                        const inSchedule = isScheduled(src.id, src.title, src.date);

                        return (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-800 truncate">
                                  {src.title}
                                </span>
                                {src.category && (
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                                    {src.category}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Calendar size={12} className="text-blue-600" />
                                  {src.date}
                                </span>

                                {src.startTime && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {src.startTime}
                                  </span>
                                )}

                                {src.location && (
                                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                                    <MapPin size={12} className="text-rose-500" />
                                    {src.location}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                              <button
                                type="button"
                                onClick={() => addToSchedule(src as any)}
                                disabled={inSchedule}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                  inSchedule
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                                    : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                                }`}
                                title={inSchedule ? "In your schedule" : "Save to My Schedule"}
                              >
                                {inSchedule ? (
                                  <>
                                    <BookmarkCheck size={12} />
                                    <span>Saved</span>
                                  </>
                                ) : (
                                  <>
                                    <BookmarkPlus size={12} />
                                    <span>+ Schedule</span>
                                  </>
                                )}
                              </button>

                              <Link
                                to="/events"
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                                title="View in Events Feed"
                              >
                                <ExternalLink size={13} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-blue-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot size={18} />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              </div>
              <span className="font-medium text-slate-500">
                Retrieving verified notices & consulting Groq Llama 3...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Sticky above input) */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap size={12} className="text-amber-500" />
          <span>Suggestions:</span>
        </span>
        {QUICK_PROMPTS.map((prompt, pIdx) => (
          <button
            key={pIdx}
            type="button"
            onClick={() => handleQuickPromptClick(prompt.query)}
            disabled={loading}
            className="px-3 py-1 rounded-xl bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-xs font-semibold text-slate-700 shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <span className="mr-1">{prompt.icon}</span>
            <span>{prompt.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
        {errorMsg && (
          <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything (e.g. When is my next exam? Any deadlines this week?)..."
            disabled={loading}
            className="flex-1 bg-transparent border-0 focus:outline-none text-xs text-slate-800 placeholder-slate-400 resize-none max-h-24 px-2 py-1 leading-relaxed"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer disabled:cursor-not-allowed"
            title="Send query"
          >
            <Send size={15} />
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line</span>
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            <Zap size={11} className="text-amber-500" /> Powered by Groq
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
