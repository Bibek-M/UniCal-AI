import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Clock,
  Sparkles,
  Save,
  RotateCcw,
  Sliders,
  CalendarDays,
  Smartphone,
  Loader2,
} from "lucide-react";

export interface StudentNotificationSettings {
  emailUrgentNotices: boolean;
  emailExamReminders: boolean;
  emailDeadlines: boolean;
  emailWeeklyDigest: boolean;
  appScheduleAlerts: boolean;
  appAiTips: boolean;
  reminderAdvanceTime: "15m" | "30m" | "1h" | "1d" | "2d";
  autoFilterBranchSemester: boolean;
}

const DEFAULT_SETTINGS: StudentNotificationSettings = {
  emailUrgentNotices: true,
  emailExamReminders: true,
  emailDeadlines: true,
  emailWeeklyDigest: false,
  appScheduleAlerts: true,
  appAiTips: true,
  reminderAdvanceTime: "1d",
  autoFilterBranchSemester: true,
};

const STORAGE_KEY = "unical_student_notifications";

interface StudentNotificationPreferencesProps {
  onSaved?: (message: string) => void;
}

const StudentNotificationPreferences: React.FC<StudentNotificationPreferencesProps> = ({ onSaved }) => {
  const [settings, setSettings] = useState<StudentNotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load notification preferences:", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const updateSetting = <K extends keyof StudentNotificationSettings>(
    key: K,
    val: StudentNotificationSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setHasUnsavedChanges(false);
      setTimeout(() => {
        setSaving(false);
        if (onSaved) {
          onSaved("Notification preferences updated and saved successfully!");
        }
      }, 300);
    } catch (err) {
      setSaving(false);
      console.error("Failed to save settings:", err);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(true);
  };

  // Sync to localStorage on unmount or changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/90 flex flex-col">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Bell size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Notification Preferences
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                Editable
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Choose which university notices, exam alerts, and deadline reminders you want to receive.
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset to default settings"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              hasUnsavedChanges
                ? "bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-300 ring-offset-1"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preferences Sections */}
      <div className="mt-6 space-y-6">
        {/* 1. Email Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mail size={16} className="text-blue-600" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Email Notifications
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              (Sent to your verified university email)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Urgent Notices */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800">
                  Urgent Notices & Circulars
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Immediate alerts for emergency campus announcements, holiday declarations, or reschedule notices.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.emailUrgentNotices}
                  onChange={(e) => updateSetting("emailUrgentNotices", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Exam Reminders */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800">
                  Exam & Timetable Reminders
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Reminders prior to mid-term dates, practical exams, viva schedules, and final examinations.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.emailExamReminders}
                  onChange={(e) => updateSetting("emailExamReminders", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Assignment & Project Deadlines */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800">
                  Submission Deadline Alerts
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Advance alerts for project review deadlines, assignment portals, and lab record submissions.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.emailDeadlines}
                  onChange={(e) => updateSetting("emailDeadlines", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Weekly Academic Digest */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800">
                  Weekly Academic Digest
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  A consolidated summary of events, seminars, and calendar activities delivered every Monday at 8:00 AM.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.emailWeeklyDigest}
                  onChange={(e) => updateSetting("emailWeeklyDigest", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 2. In-App & Schedule Alerts */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-indigo-600" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              In-Portal & Schedule Alerts
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              (Banner alerts inside Unical Portal)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* My Schedule Alerts */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800">
                  My Schedule Notifications
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Show banner reminders and countdowns for events saved to your personal schedule page.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.appScheduleAlerts}
                  onChange={(e) => updateSetting("appScheduleAlerts", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* AI Assistant Tips */}
            <div className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <div className="pr-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>AI Assistant Recommendations</span>
                  <Sparkles size={12} className="text-amber-500" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Receive personalized event suggestions and preparation tips tailored to your branch and semester.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.appAiTips}
                  onChange={(e) => updateSetting("appAiTips", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Notification Timing & Preferences */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Sliders size={16} className="text-purple-600" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Alert Timing & Customization
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reminder Lead Time Selector */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                <Clock size={15} className="text-purple-600" />
                <span>Reminder Lead Time</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2.5">
                How far in advance should schedule and deadline notifications be delivered?
              </p>
              <select
                value={settings.reminderAdvanceTime}
                onChange={(e) =>
                  updateSetting(
                    "reminderAdvanceTime",
                    e.target.value as StudentNotificationSettings["reminderAdvanceTime"]
                  )
                }
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="15m">15 minutes before</option>
                <option value="30m">30 minutes before</option>
                <option value="1h">1 hour before</option>
                <option value="1d">1 day before (Recommended)</option>
                <option value="2d">2 days before</option>
              </select>
            </div>

            {/* Auto-filter Branch and Semester */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start justify-between">
              <div className="pr-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <CalendarDays size={15} className="text-emerald-600" />
                  <span>Enrolled Filter Default</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  Automatically prioritize calendar and circular feed notices matching your branch and semester.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={settings.autoFilterBranchSemester}
                  onChange={(e) => updateSetting("autoFilterBranchSemester", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNotificationPreferences;

