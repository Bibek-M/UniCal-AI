import { apiUrl } from "../../../api";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  HelpCircle,
  X,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import { getAuthHeaders } from "../../../utils/auth";

interface FAQElement {
  _id: string;
  question: string;
  answer: string;
}

interface PreviousFaqProps {
  refreshTrigger?: number;
}

const PreviousFaq: React.FC<PreviousFaqProps> = ({ refreshTrigger }) => {
  const [faqs, setFaqs] = useState<FAQElement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Slide-over Drawer state
  const [activeFaq, setActiveFaq] = useState<FAQElement | null>(null);
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/faqs"));
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching FAQs:", err);
      setToast({
        type: "error",
        text: err.message || "Failed to load FAQs from server",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [refreshTrigger]);

  const openDrawer = (faq: FAQElement, drawerMode: "edit" | "delete") => {
    setActiveFaq({ ...faq });
    setMode(drawerMode);
  };

  const closeDrawer = () => {
    setActiveFaq(null);
    setMode(null);
  };

  // Save changes via PUT
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFaq) return;

    if (!activeFaq.question.trim() || !activeFaq.answer.trim()) {
      setToast({ type: "error", text: "Both question and answer are required." });
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(apiUrl(`/api/faqs/${activeFaq._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          question: activeFaq.question.trim(),
          answer: activeFaq.answer.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setToast({ type: "success", text: "FAQ updated successfully!" });
      closeDrawer();
      fetchFaqs();
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Failed to update FAQ" });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete FAQ via DELETE
  const handleDelete = async () => {
    if (!activeFaq) return;

    try {
      setActionLoading(true);
      const res = await fetch(apiUrl(`/api/faqs/${activeFaq._id}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setToast({ type: "success", text: "FAQ deleted successfully!" });
      closeDrawer();
      fetchFaqs();
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Failed to delete FAQ" });
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 size={16} className="text-green-600" />
            ) : (
              <AlertCircle size={16} className="text-red-600" />
            )}
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="underline hover:opacity-75 cursor-pointer ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Control Bar: Title, Search, Refresh */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800 text-base">Published FAQs</h2>
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 outline-none w-48 sm:w-64 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchFaqs}
            disabled={loading}
            className="p-1.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh FAQs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* FAQs Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading FAQs...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No FAQs found. Add one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((faq) => (
            <div
              key={faq._id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between gap-3 hover:shadow-md transition-all text-xs"
            >
              <div>
                {/* Header: Badge & Actions */}
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-2xs border bg-blue-50 text-blue-700 border-blue-200">
                    <HelpCircle size={11} /> FAQ
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openDrawer(faq, "edit")}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => openDrawer(faq, "delete")}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Question Title */}
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug line-clamp-2">
                  {faq.question}
                </h3>

                {/* Answer Preview */}
                <p className="text-slate-600 text-xs line-clamp-4 leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>

              {/* Footer Note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                <span>Student Help Center</span>
                <span className="font-mono text-slate-500">ID: {faq._id.slice(-6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Sidebar Drawer */}
      {mode && activeFaq && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={closeDrawer}
          />

          <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {mode === "edit" ? "Edit FAQ" : "Delete FAQ"}
              </h3>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode: Edit Form */}
            {mode === "edit" && (
              <form onSubmit={handleSave} className="p-5 flex flex-col gap-4 text-xs flex-1 justify-between">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1.5 block">
                      Question <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={activeFaq.question}
                      onChange={(e) =>
                        setActiveFaq({ ...activeFaq, question: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 mb-1.5 block">
                      Answer / Explanation <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={activeFaq.answer}
                      onChange={(e) =>
                        setActiveFaq({ ...activeFaq, answer: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                      required
                    />
                  </div>
                </div>

                {/* Submit / Cancel Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={13} /> {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Mode: Delete Confirmation */}
            {mode === "delete" && (
              <div className="p-5 flex flex-col justify-between flex-1 text-xs">
                <div className="space-y-4">
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <p className="font-bold text-sm">Are you sure you want to delete this FAQ?</p>
                    <p className="mt-1 text-2xs text-red-600">
                      This will permanently remove the question from the student help center.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">
                      {activeFaq.question}
                    </h4>
                    <p className="text-slate-600 text-xs line-clamp-4 leading-relaxed whitespace-pre-line">
                      {activeFaq.answer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
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

export default PreviousFaq;
