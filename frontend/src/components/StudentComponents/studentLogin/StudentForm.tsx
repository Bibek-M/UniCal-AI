import { Info } from "lucide-react";
import InputForm from "../InputForm";
const StudentForm = () => {           
  return (
    <div className="flex  flex-col ml-15">
      <div className="text-3xl font-bold">Student Login</div>
      <p className="mb-4">
        Access your personalized university calendar and updates.
      </p>
      <InputForm />
      <div className="flex mt-10 items-center">
        <div className="h-0.5 bg-gray-400 w-1/3"></div>
        <div className="mx-5">OR</div>
        <div className="h-0.5 bg-gray-400 w-1/3"></div>
      </div>
      <div className="flex bg-blue-200 p-1.5 gap-1.5 rounded-md mr-37  items-center mt-8 self-center">
        <Info color="blue" size={35}/>
        <div className="text-2xs">use your university registration number and password to access your account</div>
      </div>
    </div>
  );
}

export default StudentForm