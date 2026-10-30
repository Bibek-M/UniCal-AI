import { useState } from "react";
import { IoSend } from "react-icons/io5";

const AISearch = () => {
    const [text, setText] = useState("");
    const change=(e:any)=>{
        setText(e.target.value);
    }
    return (
    <div >
      <div className="flex items-center gap-2.5">
        <input
          type="text"
          value={text}
          onChange={change}
          placeholder="type your question "
          className="border border-gray-400 rounded-2xl px-3 py-1.5 w-4/5"
        />
        <div className="bg-blue-500 h-10 w-10 flex justify-center items-center rounded-full">
          <IoSend color="white"/>
        </div>
      </div>
    </div>
  );
};

export default AISearch;
