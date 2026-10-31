
import AdminHeader from "../../components/AdminComponents/AdminPage/AdminHeader";
import AppLogo from "../../components/AdminComponents/AdminPage/AppLogo";
import NavBar from "../../components/AdminComponents/AdminPage/NavBar";
import UsersHero from "../../components/AdminComponents/UsersPage/UsersHero";
import UsersListCard from "../../components/AdminComponents/UsersPage/UsersListCard";
const Users = () => {
  return (
     <div className="w-screen flex">
      <div className="w-2/11 bg-gray-800 px-5 h-screen py-5">
      <AppLogo/>
      <NavBar/>
    </div>
    <div className="w-9/11 bg-blue-200 h-screen">
    <div className="pl-5 rounded-2xl max-w-screen">
        <h1 ><AdminHeader/></h1>
        <div> <UsersHero/> </div>
        <div><UsersListCard/></div>
      </div>
    </div>
    </div>
  )
}

export default Users