import CollegeImage from '../assets/CollegeImage.jpg'
const StayInformed = () => {
  return (
    <div>
      <div
        className=" h-30 w-full flex items-center rounded-xl"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)) ,url(${CollegeImage})`,
          backgroundSize: "auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: "90%",
        }}
      >
        <div className="flex flex-col bg-blend-darken px-5">
          <h3 className="text-3xl text-white font-bold">
            Stay Informed .Stay ahead
          </h3>
          <h3 className=" text-white font-bold">
            All your university events in one place{" "}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default StayInformed