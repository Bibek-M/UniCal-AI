import collegeImage from "../img/CollegeImage.jpg"
const AssistantCard = () => {
  return (
    <div>
      <div
        className=" h-30 w-full flex items-center rounded-xl"
        style={{
          backgroundImage: `linear-gradient(rgba(256, 256, 256, 0.5), rgba(0, 0, 256, 0.2)) ,url(${collegeImage})`,
          backgroundSize: "auto",
          backgroundPosition:"center",
          backgroundRepeat: "no-repeat",
          opacity: "90%",
        }}
      >
        <div className="flex flex-col bg-blend-darken px-5">
          <h3 className="text-3xl text-white font-bold flex gap-2.5">
            <h2>Your University</h2>
            <h2 className="text-blue-800 font-extrabold">Companion</h2>
          </h3>
          <h3 className=" text-white font-bold">
            All your university events in one place{" "}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default AssistantCard