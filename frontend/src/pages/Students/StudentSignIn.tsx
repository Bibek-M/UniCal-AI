import { Calendar, Megaphone, Trophy, UserRoundGroup } from 'lucide-react';
import myBackgroundImage from '../assets/college.png'
import AppLogo from '../../components/StudentComponents/AppLogo';
import ContactAdmin from '../../components/StudentComponents/studentLogin/ContactAdmin';
import StudentForm from '../../components/StudentComponents/studentLogin/StudentForm';
const StudentSignIn = () => {
  return (
    <div className="bg-blue-300 h-screen w-screen flex justify-center items-center">
      <div className="rounded-2xl  h-8/9 w-12/13 flex shadow-2xl">
        <div
          className="h-full w-1/2 bg-cover bg-center bg-no-repeat rounded-tl-2xl rounded-bl-2xl flex flex-col"
          style={{ backgroundImage: `url(${myBackgroundImage})` }}
        >
          <div className="ml-14 mt-14">
            <AppLogo />
          </div>
          <div className="flex flex-col  mt-10 ml-auto">
            <h1 className="text-5xl font-extrabold">Stay Informed</h1>
            <h1 className="text-5xl font-extrabold text-blue-700">
              Stay Ahead.
            </h1>
            <p className="w-2/3 text-m font-bold">
              All your university events, exams, holidays and important updates
              in one place.
            </p>
          </div>
          <div className="bg-white h-30 w-9/10 rounded-2xl flex justify-evenly p-2 text-sm pl-5 py-5 self-center mt-auto mb-5">
            <div className="w-25">
              <Calendar
                color="#205292"
                className="bg-blue-300 h-12 w-12 p-2 rounded-2xl"
              />
              <p>Exam & Timetable</p>
            </div>
            <div className="w-30">
              <Megaphone
                color="#361986"
                className="bg-violet-300 h-12 w-12 p-2 rounded-2xl"
              />
              <p>Announcements & Notices</p>
            </div>
            <div className="w-30">
              <UserRoundGroup
                color="#1a7614"
                className="bg-green-300 h-12 w-12 p-2 rounded-2xl"
              />
              <p>Events & workshops</p>
            </div>
            <div className="w-30">
              <Trophy
                color="#b39e14"
                className="bg-yellow-200 h-12 w-12 p-2 rounded-2xl"
              />
              <p>Placements & Opportunities</p>
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-white rounded-tr-2xl rounded-br-2xl">
          <div className="flex mt-5 justify-end mx-5 mb-20">
            <ContactAdmin />
          </div>
          <StudentForm />
        </div>
      </div>
    </div>
  );
}

export default StudentSignIn