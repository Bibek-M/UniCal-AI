import AppLogo from "../AppLogo";
import SearchHome from "./SearchHome";
import UserProfile from "./UserProfile";

const HomeHeader = () => {
  return (
    <div className="flex w-full">
      <h1 className="w-1/7 ">
        <div className="bg-blue-100 p-3.5">
          <AppLogo />
        </div>
      </h1>
      <div className="flex pt-7 pb-8 px-1.5 w-4/7 rounded-2xl">
        <SearchHome />
      </div>
      <div className="ml-auto">
        <UserProfile/>
      </div>
    </div>
  );
}

export default HomeHeader