import { Megaphone } from "lucide-react";
import { IoDocumentTextOutline } from "react-icons/io5";
const QuickLinks = () => {
  return (
    <div className="mt-5 bg-white rounded-xl pr-1.5 mr-2.5 w-full pb-5 pl-3">
      <div className="text-2xl font-bold">QuickLinks</div>
      <div className="flex flex-col gap-1.5 my-5">
        <div className="flex">
          <div className="bg-blue-200 w-15 h-15 flex justify-center items-center rounded-full mr-3">
            <IoDocumentTextOutline size={35} color="blue" />
          </div>
          <a href="">
            <div className="font-bold">Academic Calendar</div>
            <div> View official academic calendar</div>
          </a>
        </div>
        <div className="flex">
          <div className="bg-amber-200 w-15 h-15 flex justify-center items-center rounded-full mr-3">
            <Megaphone size={35} color="brown" />
          </div>
          <a href="">
            <div className="font-bold">University Notices</div>
            <div> Latest announcements and updates</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
