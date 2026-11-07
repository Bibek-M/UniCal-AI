import React, { useState } from "react";
import { PlusCircle, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { getAuthHeaders } from "../../../utils/auth";

interface AddFaqProps {
  onFaqAdded?: () => void;
}

const AddFaq: React.FC<AddFaqProps> = ({ onFaqAdded }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setMsg({ type: "error", text: "Both question and answer are required." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          answer: trimmedAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create FAQ");
      }

      setMsg({ type: "success", text: "FAQ published successfully!" });
      setQuestion("");
      setAnswer("");
      if (onFaqAdded) {
        onFaqAdded();
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save FAQ" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setAnswer("");
    setMsg(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Add New FAQ</h2>
          <p className="text-xs text-slate-500">
            Publish a question and clear answer directly to the student help desk.
          </p>
        </div>
        {msg && (
          <div
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
              msg.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 size={14} className="shrink-0" />
            ) : (
              <AlertCircle size={14} className="shrink-0" />
            )}
            <span>{msg.text}</span>
            <button
              onClick={() => setMsg(null)}
              className="ml-2 underline text-2xs hover:opacity-75 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Question Field */}
        <div>
          <label className="font-semibold text-slate-700 mb-1.5 block">
            Question <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. How do I apply for a scholarship or fee waiver?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 transition-all"
            required
          />
        </div>

        {/* Answer Field */}
        <div>
          <label className="font-semibold text-slate-700 mb-1.5 block">
            Answer / Resolution <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Provide comprehensive, step-by-step instructions or explanations..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs sm:text-sm text-slate-800 resize-none transition-all"
            required
          />
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all font-medium cursor-pointer"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <PlusCircle size={14} />
                <span>Add FAQ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFaq;
