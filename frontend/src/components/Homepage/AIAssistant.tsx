import { Bot, } from "lucide-react";
import { FaChevronRight } from "react-icons/fa6";
import AISearch from "./AISearch";
const AIAssistant = () => {
  return (
    <div className=" bg-white rounded-xl pr-1.5 mr-2.5 w-full pb-5">
      <div className="flex items-center  gap-1.5">
        <div>
          <Bot color="blue" size={38} />
        </div>
        <div>
          <div className="font-bold text-2xl">AI Assistant</div>
          <div>
            Ask anything about university events,exams,holidays and more
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 pb-4">
        <div className="flex items-center gap-5 px-4 bg-blue-200 rounded-xl mr-8 ml-3.5 py-1.5 justify-between">
          <div>What are the exam dates for CSE 7th sem?</div>
          <FaChevronRight color="blue" />
        </div>
        <div className="flex items-center gap-5 px-4 bg-blue-200 rounded-xl mr-8 ml-3.5 py-1.5 justify-between">
          <div>What are the exam dates for CSE 7th sem?</div>
          <FaChevronRight color="blue" />
        </div>
        <div className="flex items-center gap-5 px-4 bg-blue-200 rounded-xl mr-8 ml-3.5 py-1.5 justify-between">
          <div>What are the exam dates for CSE 7th sem?</div>
          <FaChevronRight color="blue" />
        </div>
        <div className="flex items-center gap-5 px-4 bg-blue-200 rounded-xl mr-8 ml-3.5 py-1.5 justify-between">
          <div>What are the exam dates for CSE 7th sem?</div>
          <FaChevronRight color="blue" />
        </div>
      </div>
      <div className="ml-3.5">
        <AISearch />
      </div>
    </div>
  );
}

export default AIAssistant