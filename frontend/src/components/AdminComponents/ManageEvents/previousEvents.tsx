import { apiUrl } from "../../../api";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Building2,
  Star,
  X,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import type { CalendarEvent, EventCategory } from "../../../types/calendar";
import { getAuthHeaders } from "../../../utils/auth";

const CATEGORY_COLORS: Record<EventCategory, string> = {
  academic: "bg-red-50 text-red-700 border-red-200",
  holiday: "bg-green-50 text-green-700 border-green-200",
  event: "bg-purple-50 text-purple-700 border-purple-200",
  placement: "bg-orange-50 text-orange-700 border-orange-200",
  deadline: "bg-blue-50 text-blue-700 border-blue-200",
};

const PreviousEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Sidebar Drawer
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/events"));
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openDrawer = (ev: CalendarEvent, drawerMode: "edit" | "delete") => {
    setActiveEvent({ ...ev });
    setMode(drawerMode);
  };

  const closeDrawer = () => {
    setActiveEvent(null);
    setMode(null);
  };

  // Convert HTML date (YYYY-MM-DD) <-> DD-MM-YYYY
  const handleEditDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val || !activeEvent) return;
    const [y, m, d] = val.split("-");
    setActiveEvent({ ...activeEvent, date: `${d}-${m}-${y}` });
  };

  const getHtmlDate = (d?: string) => {
    if (!d || !d.includes("-")) return "";
    const [day, month, year] = d.split("-");
    return year?.length === 4 ? `${year}-${month}-${day}` : "";
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;
    const id = activeEvent._id || activeEvent.id;

    try {
      setActionLoading(true);
      const res = await fetch(apiUrl(`/api/events/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(activeEvent),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setToast({ type: "success", text: "Event updated successfully!" });
      closeDrawer();
      fetchEvents();
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Failed to update" });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!activeEvent) return;
    const id = activeEvent._id || activeEvent.id;

    try {
      setActionLoading(true);
      const res = await fetch(apiUrl(`/api/events/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Delete failed");

      setToast({ type: "success", text: "Event deleted successfully!" });
      closeDrawer();
      fetchEvents();
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Failed to delete" });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = events.filter((ev) =>
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.date.includes(search) ||
    ev.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Toast Alert */}
      {toast && (
        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${toast.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="underline">Dismiss</button>
        </div>
      )}

      {/* Bar: Title, Search, Refresh */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800 text-base">Previous Events</h2>
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 outline-none w-44 sm:w-56"
            />
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-1.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600 transition-all"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading events...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev) => (
            <div
              key={ev._id || ev.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between gap-3 hover:shadow-md transition-all text-xs"
            >
              <div>
                {/* Header: Category Badge & Action Buttons */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-2xs border ${CATEGORY_COLORS[ev.category] || "bg-slate-100 text-slate-700"}`}>
                      {ev.category}
                    </span>
                    {ev.isImportant && (
                      <span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-full text-2xs border border-red-200 flex items-center gap-0.5">
                        <Star size={10} className="fill-red-600 text-red-600" /> Important
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openDrawer(ev, "edit")}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit Event"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => openDrawer(ev, "delete")}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug line-clamp-1">
                  {ev.title}
                </h3>
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              {/* Meta details */}
              <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-500 text-2xs">
                <div className="flex items-center gap-1.5 font-mono text-slate-700 font-semibold">
                  <Calendar size={13} className="text-blue-600" />
                  <span>{ev.date}</span>
                  {ev.startTime && <span className="text-slate-400 font-normal">({ev.startTime})</span>}
                </div>
                {ev.location && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={13} className="text-red-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                )}
                {ev.department && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{ev.department}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Sidebar Drawer */}
      {mode && activeEvent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={closeDrawer} />

          <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {mode === "edit" ? "Edit Event" : "Delete Event"}
              </h3>
              <button onClick={closeDrawer} className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
                <X size={16} />
              </button>
            </div>

            {/* Mode: Edit Form */}
            {mode === "edit" && (
              <form onSubmit={handleSave} className="p-5 flex flex-col gap-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Title *</label>
                  <input
                    type="text"
                    value={activeEvent.title}
                    onChange={(e) => setActiveEvent({ ...activeEvent, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Category</label>
                    <select
                      value={activeEvent.category}
                      onChange={(e) => setActiveEvent({ ...activeEvent, category: e.target.value as EventCategory })}
                      className="w-full px-2 py-2 rounded-xl border border-slate-300 outline-none capitalize bg-white"
                    >
                      <option value="academic">Academic</option>
                      <option value="holiday">Holiday</option>
                      <option value="event">Campus Event</option>
                      <option value="placement">Placement</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Date (DD-MM-YYYY) *</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={activeEvent.date}
                        onChange={(e) => setActiveEvent({ ...activeEvent, date: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-mono outline-none"
                        required
                      />
                      <input
                        type="date"
                        value={getHtmlDate(activeEvent.date)}
                        onChange={handleEditDate}
                        className="w-9 px-1 border border-slate-300 rounded-xl cursor-pointer bg-slate-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Start Time</label>
                    <input
                      type="text"
                      value={activeEvent.startTime || ""}
                      onChange={(e) => setActiveEvent({ ...activeEvent, startTime: e.target.value })}
                      placeholder="10:00 AM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">End Time</label>
                    <input
                      type="text"
                      value={activeEvent.endTime || ""}
                      onChange={(e) => setActiveEvent({ ...activeEvent, endTime: e.target.value })}
                      placeholder="01:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Venue</label>
                  <input
                    type="text"
                    value={activeEvent.location || ""}
                    onChange={(e) => setActiveEvent({ ...activeEvent, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Department</label>
                  <input
                    type="text"
                    value={activeEvent.department || ""}
                    onChange={(e) => setActiveEvent({ ...activeEvent, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Description *</label>
                  <textarea
                    rows={3}
                    value={activeEvent.description}
                    onChange={(e) => setActiveEvent({ ...activeEvent, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none resize-none"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 py-1">
                  <input
                    type="checkbox"
                    checked={activeEvent.isImportant || false}
                    onChange={(e) => setActiveEvent({ ...activeEvent, isImportant: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Mark as Important Event</span>
                </label>

                {/* Submit / Cancel */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50"
                  >
                    <Save size={13} /> {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Mode: Delete Confirmation */}
            {mode === "delete" && (
              <div className="p-5 flex flex-col justify-between flex-1 text-xs">
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <p className="font-bold">Are you sure you want to delete this event?</p>
                    <p className="mt-1 text-2xs text-red-600">This will permanently remove it from student calendars.</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm">{activeEvent.title}</h4>
                    <p className="text-slate-500 font-mono">📅 {activeEvent.date}</p>
                    <p className="text-slate-600 text-2xs line-clamp-2">{activeEvent.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-50"
                  >
                    <Trash2 size={13} /> {actionLoading ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default PreviousEvents;