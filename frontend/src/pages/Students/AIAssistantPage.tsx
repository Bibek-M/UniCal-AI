import { useState } from "react";
import HomeHeader from "../../components/StudentComponents/Homepage/HomeHeader";
import NavBar from "../../components/StudentComponents/NavBar";
import AssistantCard from "../../components/StudentComponents/AIAssistant/AssistantCard";
import AIChat from "../../components/StudentComponents/AIAssistant/AIChat";

const AIAssistantPage = () => {
  const [clearTrigger, setClearTrigger] = useState<number>(0);
  const [messageCount, setMessageCount] = useState<number>(0);

  const handleClearChat = () => {
    setClearTrigger((prev) => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50/60 overflow-hidden">
      {/* Top Header */}
      <HomeHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <div className="w-1/7 shrink-0 h-full bg-blue-100 overflow-y-auto">
          <NavBar />
        </div>

        {/* Main Content Area */}
        <div className="w-6/7 flex flex-col h-full p-3 sm:p-5 overflow-hidden">
          {/* Top Banner / Hero Card */}
          <AssistantCard
            onClearChat={handleClearChat}
            messageCount={messageCount}
          />

          {/* Chat Interface Container (Fills Remaining Height) */}
          <div className="flex-1 overflow-hidden min-h-0">
            <AIChat
              onMessageCountChange={setMessageCount}
              clearTrigger={clearTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
