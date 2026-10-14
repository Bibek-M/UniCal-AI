import AIChat from "../components/AIChat";
import HomeHeader from "../components/Homepage/HomeHeader";
import NavBar from "../components/NavBar";

const AIAssistantPage = () => {
  return (
    <div className="bg-gray-200 h-screen">
      <HomeHeader />
      <div className="flex">
      <div className="w-1/7">
        <NavBar />
      </div>
      <div className="w-6/7 justify-end items-end h-full mt-auto">
        <AIChat/>
      </div>
      </div>
    </div>
  );
}

export default AIAssistantPage