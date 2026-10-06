import { CalendarDays } from "lucide-react";

const AppLogo = () => {
  return (
    <div className="flex gap-2">
      <CalendarDays color="blue" size={54} />
      <div className="flex flex-col">
        <div className="flex gap-2 text-3xl font-bold">
          <div className="flex">
            <h1>Uni</h1>
            <h1 className="text-blue-700">Cal</h1>
          </div>
          <h1 className="text-blue-700">AI</h1>
        </div>
        <div>Your university .All Events.One place</div>
      </div>
    </div>
  );
};

export default AppLogo;
