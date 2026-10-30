import AIChat from "../../components/StudentComponents/AIAssistant/AIChat";
import AssistantCard from "../../components/StudentComponents/AIAssistant/AssistantCard";
import HomeHeader from "../../components/StudentComponents/Homepage/HomeHeader";
import NavBar from "../../components/StudentComponents/NavBar";

const AIAssistantPage = () => {
  return (
    <div className="bg-gray-200 h-screen flex flex-col">
      <HomeHeader />
      <div className="flex">
        <div className="w-1/7">
          <NavBar />
        </div>
        <div className="w-6/7  h-full flex flex-col ">
          <div>
            <AssistantCard />
          </div>
          <div className=" mt-auto">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantPage