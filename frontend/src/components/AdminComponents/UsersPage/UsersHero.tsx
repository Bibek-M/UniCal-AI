import { CirclePlus } from "lucide-react";

const UsersHero = () => {
  return (
    <div className="flex justify-between pr-10 items-center">
      <div>
      <h2 className="text-blue-600 text-2xl font-semibold">Users</h2>
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <p>View,Search and manage all registered users </p>
      </div>
      <div>
        <button className="flex gap-2.5 bg-blue-800 text-white px-3 py-2 rounded-2xl active:scale-110"><CirclePlus/> Add User</button>
      </div>
    </div>
  )
}

export default UsersHero