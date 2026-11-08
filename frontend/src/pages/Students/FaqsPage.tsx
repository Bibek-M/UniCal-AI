import FaqHero from "../../components/StudentComponents/FaqPage/FaqHero";
import FAQListCard from "../../components/StudentComponents/FaqPage/FAQListCard";
import HomeHeader from "../../components/StudentComponents/Homepage/HomeHeader";
import NavBar from "../../components/StudentComponents/NavBar";

const FaqsPage = () => {
  return (
    <div className="h-screen flex flex-col ">
      <HomeHeader />
      <div className="flex">
        <div className="w-1/7 ">
          <NavBar />
        </div>
        <div className="w-6/7  h-full flex flex-col mr-2 ml-2">
          <div>
       <FaqHero/>
          </div>
          <div>
          <FAQListCard/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqsPage