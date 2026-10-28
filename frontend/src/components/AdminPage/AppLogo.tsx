import { CalendarDays } from "lucide-react";
const AppLogo = () => {
  return (
     <div className="flex gap-2">
      <CalendarDays color="blue" size={54} />
      <div className="flex flex-col">
        <div className="flex gap-2 text-3xl font-bold">
          <div className="flex">
            <h1 className="text-white">Uni</h1>
            <h1 className="text-white">Cal</h1>
          </div>
          <h1 className="text-blue-700">AI</h1>
        </div>
        <div className="text-xs text-white">Admin Panel</div>
      </div>
    </div>
  )
}

export default AppLogo