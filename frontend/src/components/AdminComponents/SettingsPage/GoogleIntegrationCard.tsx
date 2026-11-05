import { useState, useEffect } from "react";
import { CheckCircle2, Info, Sparkles } from "lucide-react";

const GoogleIntegrationCard = () => {
  // Check if persisted in localStorage
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem("unical_google_connected") === "true";
    } catch {
      return false;
    }
  });

  const [notification, setNotification] = useState<{ type: "success" | "info"; text: string } | null>(null);

  const handleToggle = () => {
    const nextState = !isConnected;
    setIsConnected(nextState);

    try {
      localStorage.setItem("unical_google_connected", String(nextState));
    } catch (err) {
      console.error("Storage error:", err);
    }

    if (nextState) {
      setNotification({
        type: "success",
        text: "Google Calendar sync toggle enabled! (Full Google OAuth 2.0 handshake will be implemented later)",
      });
    } else {
      setNotification({
        type: "info",
        text: "Google Calendar sync toggle turned off.",
      });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* Toast feedback */}
      {notification && (
        <div
          className={`mb-4 p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <Info size={16} className="text-blue-600" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-2xs underline hover:opacity-75 cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <span>Third-Party Integrations</span>
          </h2>
          <p className="text-xs text-slate-500">
            Connect external productivity tools and calendar services to automate timetable publishing.
          </p>
        </div>
        <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
          Experimental Features
        </span>
      </div>

      {/* Google Integration Block */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left info & Google logo */}
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Official Google G Logo SVG */}
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0 p-2.5">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-sm">Connect with Google</h3>
              <span
                className={`text-3xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Synchronize university events and examination timetables directly with Google Calendar.
            </p>
          </div>
        </div>

        {/* Right Toggle Switch */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <span className="text-xs font-semibold text-slate-600">
            {isConnected ? "Active" : "Off"}
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isConnected}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Info notice about future implementation */}
      <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-2xs text-blue-800">
          <strong>Note:</strong> Google OAuth 2.0 account authentication and two-way calendar sync integration has been enabled for frontend configuration and will be linked with backend API credentials in an upcoming release.
        </p>
      </div>
    </div>
  );
};

export default GoogleIntegrationCard;
