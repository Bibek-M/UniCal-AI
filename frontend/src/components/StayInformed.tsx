import CollegeImage from '../assets/CollegeImage.jpg'
const StayInformed = () => {
  return (
    <div>
      <div
        className=" h-80 w-120 flex items-center "
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)) ,url(${CollegeImage})`,
          backgroundSize: "auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: "90%",
        }}
      >
        <div className="flex flex-col bg-blend-darken">
          <h3 className="text-2xl text-white font-extrabold">
            Stay Informed .Stay ahead
          </h3>
          <h3 className="text-2xl text-white font-extrabold">
            All your university events in one place{" "}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default StayInformed