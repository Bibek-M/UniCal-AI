import {Link} from "react-router-dom"
const ContactAdmin = () => {
  return (
    <div>
      <div className="flex gap-2.5">
            <p>New to UniCal AI ? </p>
            <Link to="/contactAdmin" className="text-blue-800 underline">contact Admin</Link>
          </div> 
    </div>
  );
}

export default ContactAdmin