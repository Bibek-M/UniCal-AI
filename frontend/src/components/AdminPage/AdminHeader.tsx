import AdminProfile from "./AdminProfile";
import SearchAdmin from "./SearchUsers";

const AdminHeader = () => {
  return (
        <div className="flex w-full">
      <div className="flex pt-7 pb-8 px-1.5 w-5/7 rounded-2xl">
        <SearchAdmin/>
      </div>
      <div className="ml-auto">
      <AdminProfile/>
      </div>
    </div>
  )
}

export default AdminHeader