import React, { useState } from "react";
import {
  CalendarPlus,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  Star,
  RotateCcw,
  Tag,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { getAuthHeaders } from "../../../utils/auth";
import { PdfEventExtractor } from "./PdfEventExtractor";

export type EventCategory = "academic" | "holiday" | "event" | "placement" | "deadline";

export interface EventFormData {
  title: string;
  description: string;
  date: string; // DD-MM-YYYY
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  department: string;
  branch: string[];
  semester: number[];
  organizer: string;
  isImportant: boolean;
}

const initialFormState: EventFormData = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  category: "academic",
  department: "",
  branch: [],
  semester: [],
  organizer: "",
  isImportant: false,
};

const AVAILABLE_BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const ALL_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const CATEGORY_CONFIG: Record<
  EventCategory,
  { label: string; badgeClass: string; borderClass: string }
> = {
  academic: {
    label: "Academic",
    badgeClass: "bg-red-100 text-red-700",
    borderClass: "border-red-300",
  },
  holiday: {
    label: "Holiday",
    badgeClass: "bg-green-100 text-green-700",
    borderClass: "border-green-300",
  },
  event: {
    label: "Campus Event",
    badgeClass: "bg-purple-100 text-purple-700",
    borderClass: "border-purple-300",
  },
  placement: {
    label: "Placement",
    badgeClass: "bg-orange-100 text-orange-700",
    borderClass: "border-orange-300",
  },
  deadline: {
    label: "Deadline",
    badgeClass: "bg-blue-100 text-blue-700",
    borderClass: "border-blue-300",
  },
};

const AddEvents = () => {
  const [formData, setFormData] = useState<EventFormData>(initialFormState);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Helper: Convert YYYY-MM-DD from HTML date input to DD-MM-YYYY
  const handleNativeDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value; // "YYYY-MM-DD"
    if (!rawValue) {
      setFormData((prev) => ({ ...prev, date: "" }));
      return;
    }
    const [year, month, day] = rawValue.split("-");
    setFormData((prev) => ({ ...prev, date: `${day}-${month}-${year}` }));
  };

  // Helper: Convert DD-MM-YYYY back to YYYY-MM-DD for native date picker value
  const getNativeDateValue = (d: string) => {
    if (!d || !d.includes("-")) return "";
    const parts = d.split("-");
    if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return "";
  };

  const toggleBranch = (branchName: string) => {
    setFormData((prev) => {
      const exists = prev.branch.includes(branchName);
      return {
        ...prev,
        branch: exists
          ? prev.branch.filter((b) => b !== branchName)
          : [...prev.branch, branchName],
      };
    });
  };

  const toggleSemester = (sem: number) => {
    setFormData((prev) => {
      const exists = prev.semester.includes(sem);
      return {
        ...prev,
        semester: exists
          ? prev.semester.filter((s) => s !== sem)
          : [...prev.semester, sem].sort((a, b) => a - b),
      };
    });
  };

  const selectAllSemesters = () => {
    setFormData((prev) => ({
      ...prev,
      semester:
        prev.semester.length === ALL_SEMESTERS.length ? [] : [...ALL_SEMESTERS],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Front-end validation
    if (!formData.title.trim()) {
      setStatusMessage({ type: "error", text: "Please enter an event title." });
      return;
    }
    if (!formData.description.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter an event description.",
      });
      return;
    }
    if (!formData.date.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please select or provide an event date.",
      });
      return;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!dateRegex.test(formData.date)) {
      setStatusMessage({
        type: "error",
        text: "Invalid date format. Expected DD-MM-YYYY (e.g. 15-09-2026).",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setStatusMessage({
        type: "success",
        text: `Event "${formData.title}" published successfully!`,
      });
      setFormData(initialFormState);
    } catch (err: any) {
      console.error("Error creating event:", err);
      setStatusMessage({
        type: "error",
        text: err.message || "Something went wrong while publishing the event.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAiExtractedEvent = (extractedData: Partial<EventFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...extractedData,
      title: extractedData.title ?? prev.title,
      description: extractedData.description ?? prev.description,
      date: extractedData.date ?? prev.date,
      startTime: extractedData.startTime ?? prev.startTime,
      endTime: extractedData.endTime ?? prev.endTime,
      location: extractedData.location ?? prev.location,
      category: extractedData.category ?? prev.category,
      department: extractedData.department ?? prev.department,
      branch: extractedData.branch ?? prev.branch,
      semester: extractedData.semester ?? prev.semester,
      organizer: extractedData.organizer ?? prev.organizer,
      isImportant:
        extractedData.isImportant !== undefined
          ? extractedData.isImportant
          : prev.isImportant,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-6">
      {/* Gemini AI Document Extractor Dropzone */}
      <PdfEventExtractor
        onEventExtracted={handleAiExtractedEvent}
        setParentStatusMessage={setStatusMessage}
      />

      {/* Status Feedback Notification */}
      {statusMessage && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="shrink-0 text-green-600" size={20} />
          ) : (
            <AlertCircle className="shrink-0 text-red-600" size={20} />
          )}
          <span className="flex-1">{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs underline hover:opacity-75 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Mid Semester Examination"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    "academic",
                    "holiday",
                    "event",
                    "placement",
                    "deadline",
                  ] as EventCategory[]
                ).map((cat) => {
                  const isSelected = formData.category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() =>
                        setFormData({ ...formData, category: cat })
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all text-center cursor-pointer ${
                        isSelected
                          ? `${CATEGORY_CONFIG[cat].badgeClass} ${CATEGORY_CONFIG[cat].borderClass} ring-2 ring-blue-500`
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {CATEGORY_CONFIG[cat].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Picker (DD-MM-YYYY) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Event Date (DD-MM-YYYY) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    placeholder="DD-MM-YYYY (e.g. 15-09-2026)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    required
                  />
                  <input
                    type="date"
                    value={getNativeDateValue(formData.date)}
                    onChange={handleNativeDatePick}
                    title="Click calendar icon to pick date"
                    className="w-11 px-2 py-2.5 rounded-xl border border-slate-300 cursor-pointer bg-slate-50 hover:bg-slate-100"
                  />
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  Format: DD-MM-YYYY (or use the calendar picker)
                </span>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Location / Venue
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Main Auditorium / Exam Hall 1"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Time Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    placeholder="e.g. 10:00 AM"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  End Time
                </label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    placeholder="e.g. 01:00 PM"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Department & Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="e.g. Computer Science"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Organizer
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-3.5 top-3.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) =>
                      setFormData({ ...formData, organizer: e.target.value })
                    }
                    placeholder="e.g. Examination Cell"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Target Branches */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Eligible Branches (Leave blank for all branches)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_BRANCHES.map((b) => {
                  const isChecked = formData.branch.includes(b);
                  return (
                    <button
                      type="button"
                      key={b}
                      onClick={() => toggleBranch(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Semesters */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Target Semesters (Leave blank for all)
                </label>
                <button
                  type="button"
                  onClick={selectAllSemesters}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  {formData.semester.length === ALL_SEMESTERS.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_SEMESTERS.map((sem) => {
                  const isChecked = formData.semester.includes(sem);
                  return (
                    <button
                      type="button"
                      key={sem}
                      onClick={() => toggleSemester(sem)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold border flex items-center justify-center transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      S{sem}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Description / Notice Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Provide detailed instructions or notice information for students..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Important Flag */}
            <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                id="isImportant"
                checked={formData.isImportant}
                onChange={(e) =>
                  setFormData({ ...formData, isImportant: e.target.checked })
                }
                className="h-4 w-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
              />
              <label
                htmlFor="isImportant"
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-900 cursor-pointer"
              >
                <Star size={16} className="text-amber-500 fill-amber-500" />
                Mark as High Priority / Important Event
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setFormData(initialFormState)}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-all cursor-pointer"
              >
                <RotateCcw size={15} />
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <CalendarPlus size={16} />
                    <span>Publish Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column (Span 1) */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-200 sticky top-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-3">
              <Sparkles size={16} className="text-amber-500" />
              <span>Live Student Preview</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              This is how the event card will appear to students on the calendar
              and details drawer.
            </p>

            {/* Preview Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    formData.category === "academic"
                      ? "bg-red-500"
                      : formData.category === "holiday"
                      ? "bg-green-500"
                      : formData.category === "event"
                      ? "bg-purple-500"
                      : formData.category === "placement"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {formData.title || "Untitled Event"}
                    </h3>
                    {formData.isImportant && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-2xs font-bold text-red-600">
                        Important
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-block mt-1.5 px-2 py-0.5 rounded text-2xs font-semibold ${
                      CATEGORY_CONFIG[formData.category].badgeClass
                    }`}
                  >
                    {CATEGORY_CONFIG[formData.category].label}
                  </span>

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {formData.description ||
                      "Detailed event instructions and announcements will appear here."}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="font-mono text-slate-700 font-semibold">
                        {formData.date || "DD-MM-YYYY"}
                      </span>
                    </div>

                    {(formData.startTime || formData.endTime) && (
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>
                          {formData.startTime || "Start"}
                          {formData.endTime ? ` – ${formData.endTime}` : ""}
                        </span>
                      </div>
                    )}

                    {formData.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{formData.location}</span>
                      </div>
                    )}

                    {formData.department && (
                      <div className="flex items-center gap-2">
                        <GraduationCap size={13} className="text-slate-400" />
                        <span>{formData.department}</span>
                      </div>
                    )}
                  </div>

                  {formData.branch.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {formData.branch.map((b) => (
                        <span
                          key={b}
                          className="bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 text-2xs font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {formData.semester.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {formData.semester.map((s) => (
                        <span
                          key={s}
                          className="bg-slate-200 text-slate-700 rounded px-1.5 py-0.5 text-2xs font-medium"
                        >
                          Sem {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvents;