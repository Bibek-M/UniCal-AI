import AppLogo from "../AppLogo";
import SearchHome from "./SearchHome";
import UserProfile from "./UserProfile";

const HomeHeader = () => {
  return (
    <header className="flex items-center w-full bg-white/50 backdrop-blur-xs border-b border-slate-200/60 shadow-2xs">
      <div className="w-1/7 shrink-0">
        <div className="bg-blue-100 p-3.5 flex items-center">
          <AppLogo />
        </div>
      </div>
      <div className="w-4/7 px-4 py-3.5">
        <SearchHome />
      </div>
      <div className="ml-auto flex items-center pr-3">
        <UserProfile />
      </div>
    </header>
  );
};

export default HomeHeader;
