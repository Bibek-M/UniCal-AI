import { HiOutlineLightBulb } from "react-icons/hi";

const Quote = () => {
  return (
    <div className=" bg-blue-100 items-center h-60 flex px-5 gap-3">
       <div>
         <HiOutlineLightBulb size={60} color="blue"/>
       </div>
       <div className="text-blue-800 font-semi-bold">
      <div>  A well planned semester</div>
      <div>  leads to a brighter future.</div>
       </div>
    </div>
  )
}

export default Quote