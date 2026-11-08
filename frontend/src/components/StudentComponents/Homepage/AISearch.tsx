import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AISearch = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    navigate(`/aiAssistant?q=${encodeURIComponent(trimmed)}`, {
      state: { initialQuery: trimmed },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Unical AI (e.g. When is my next exam?)..."
          className="border border-gray-300 rounded-2xl px-4 py-2 w-4/5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 h-10 w-10 flex justify-center items-center rounded-full text-white transition-colors cursor-pointer shrink-0 shadow-xs"
          title="Ask AI Assistant"
        >
          <IoSend size={16} />
        </button>
      </div>
    </div>
  );
};

export default AISearch;
