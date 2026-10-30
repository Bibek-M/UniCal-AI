import { Search } from "lucide-react";
import { useState } from "react";
const SearchAdmin = () => {
    const [searching, setSearch] = useState("");
  const change = (e: any) => {
    setSearch(e.target.value);
  };
  return (
     <div className="flex gap-3.5 bg-white w-full rounded-2xl p-1.5">
        <div>
          <Search />
        </div>
        <div className="w-full">
          <input
            type="text"
            value={searching}
            onChange={change}
            placeholder="search users by name, email, roll number"
            className="w-full outline-none focus:ring-0 "
            
          />
        </div>
      </div>
  )
}

export default SearchAdmin