import { Eye, EyeOff, Lock, MoveRight, UserRound } from "lucide-react";
import { useState } from "react";
const InputForm = () => {
  const [text, setText] = useState("");
  const change = (e: any) => {
    setText(e.target.value);
  };
  const [password, setPassword] = useState("");
  const changePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const [showPassword, setShowPassword] = useState(false);
  const viewPass = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div>
      <div className="font-bold my-2">Registration Number</div>
      <div className="flex shadow-2xl border w-3/4 items-center px-2 py-1 rounded-sm gap-2.5">
      <UserRound/>
      <input
      className="w-full p-1.5"
        type="text"
        value={text}
        onChange={change}
        placeholder="Enter Your registration number"
      />      
      </div>
      <div className="font-bold my-2">Password</div>
      <div className="flex shadow-2xl border w-3/4 items-center px-2 py-1 justify-between rounded-sm">
        <div className="flex items-center gap-2.5">
          <Lock />
          <input
            className="p-1.5 w-full"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={changePass}
            placeholder="Enter Your password"
          />
        </div>
        <button onClick={viewPass}>
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
      <button className="bg-blue-600 text-white text-2xl w-3/4 p-1.5 flex justify-center items-center gap-3.5 rounded-sm mt-15">
      <div>Login</div> <MoveRight/> </button>
    </div>
  );
};

export default InputForm;
