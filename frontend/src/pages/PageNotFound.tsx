import { Link } from 'react-router-dom';
import wrongRoute from '../assets/wrong-route.webp'
const PageNotFound = () => {
  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <img className='w-1/3' src={wrongRoute} alt="" />
      <div className="w-1/2 flex flex-col items-center">
        <h1 className="text-blue-700 font-bold text-2xl">You are Lost</h1>
        <h2 className="text-white font-bold text-6xl">Wrong route</h2>
        <h3 className="text-green-800 font-bold text-4xl">Navigate to other Routes</h3>
        <Link to="/home" className='text-3xl bg-white w-45 h-auto p-1.5 rounded-2xl mt-6'>Go to Home </Link>
      </div>
    </div>
  );
}

export default PageNotFound