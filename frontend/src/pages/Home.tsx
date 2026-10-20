import HomeHeader from '../components/Homepage/HomeHeader'
import AIAssistant from '../components/Homepage/AIAssistant';
import QuickLinks from '../components/Homepage/QuickLinks';
import MainCalender from '../components/MainCalender';
import NavBar from '../components/NavBar';
import StayInformed from '../components/StayInformed'
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
        <MainCalender/>
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