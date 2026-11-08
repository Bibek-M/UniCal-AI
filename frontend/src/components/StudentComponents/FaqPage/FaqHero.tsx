import { MessageCircleQuestionMark } from "lucide-react";

const FaqHero = () => {
  return (
    <div className="flex justify-between pr-10 items-center bg-blue-300 px-8 py-4 rounded-2xl  shadow-2xs shadow-white">
      <div>
      <h2 className="text-blue-600 text-xl font-semibold">Help and support</h2>
      <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      <p>Find quick answers to common questions about UniCal AI.</p>
      </div>
      <div className="pr-20">
       <MessageCircleQuestionMark size={90} fill="blue" color="white" />
      </div>
    </div>
  )
}

export default FaqHero