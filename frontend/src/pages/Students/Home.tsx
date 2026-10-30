import HomeHeader from '../../components/StudentComponents/Homepage/HomeHeader'
import AIAssistant from '../../components/StudentComponents/Homepage/AIAssistant';
import QuickLinks from '../../components/StudentComponents/Homepage/QuickLinks';
import MainCalender from "../../components/StudentComponents/MainCalender"
import NavBar from '../../components/StudentComponents/NavBar';
import StayInformed from '../../components/StudentComponents/StayInformed'
import { mockEvents } from "../../data/mockEvents";
const Home = () => {
  return (
    <div className="bg-gray-200 h-screen">
      <div>
        <h1 className="w-screen"><HomeHeader/></h1>
      </div>
        <div className='flex w-screen'>
       <div className='w-1/7'>
         <NavBar/>
       </div>
        <div className="w-4/7 px-3">
        <StayInformed/>
        <MainCalender events={mockEvents}/>
        </div>
        <div>
          <AIAssistant/>
          <QuickLinks/>
        </div>
        </div>
    </div>
  )
}

export default Home