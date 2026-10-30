import AppLogo from "../../components/AdminComponents/AdminPage/AppLogo";
import NavBar from "../../components/AdminComponents/AdminPage/NavBar";
const AdminPage = () => {
  return (
    <div className="w-screen flex">
      <div className="w-2/11 bg-gray-800 px-5 h-screen py-5">
      <AppLogo/>
      <NavBar/>
    </div>
    <div className="w-9/11 bg-blue-200 h-screen">

    </div>
    </div>
  )
}

export default AdminPage