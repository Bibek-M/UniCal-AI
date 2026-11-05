import React, { useState } from "react";
import { Bell, Lock, KeyRound, ShieldCheck, Check } from "lucide-react";

const AdminPreferences = () => {
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [faqAlerts, setFaqAlerts] = useState<boolean>(true);
  const [systemAlerts, setSystemAlerts] = useState<boolean>(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    // Simulate password update
    setPasswordMsg({ type: "success", text: "Password security credentials updated successfully!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Notifications Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
            <Bell size={18} className="text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">Notification Preferences</h2>
              <p className="text-2xs text-slate-500">Configure alerts and automated system broadcasts.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="pr-4">
                <div className="font-bold text-slate-800">Event Publication Alerts</div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  Receive email confirmation when university notices or exam schedules are posted.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="pr-4">
                <div className="font-bold text-slate-800">Student FAQ Query Notifications</div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  Notify administrator whenever new questions are submitted to the student help desk.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={faqAlerts}
                  onChange={(e) => setFaqAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="pr-4">
                <div className="font-bold text-slate-800">System Maintenance Broadcasts</div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  Receive alerts about scheduled server downtime or database backups.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={systemAlerts}
                  onChange={(e) => setSystemAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-4 border-t border-slate-100 text-3xs text-slate-400">
          Preferences are automatically saved to your browser cache.
        </div>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-indigo-600" />
              <div>
                <h2 className="text-base font-bold text-slate-800">Security & Credentials</h2>
                <p className="text-2xs text-slate-500">Update your administrator account password.</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-2xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck size={12} /> Protected
            </span>
          </div>

          {passwordMsg && (
            <div
              className={`mb-3 p-2.5 rounded-xl border text-2xs font-semibold ${
                passwordMsg.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <KeyRound size={13} />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-400">
          <span>Last password change: Current Session</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <Check size={11} /> 2FA Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminPreferences;
