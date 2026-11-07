
import InputFormAdmin from "./InputFormAdmin";
const AdminFormIn = () => {
  return (
  <div className="flex flex-col ml-15">
      <div className="text-3xl font-bold">Admin Login</div>
      <p className="mb-4">
        Access your personalized university calendar and updates.
      </p>
      <div className="items-center">
      <InputFormAdmin />

      </div>
    </div>
  )
}

export default AdminFormIn