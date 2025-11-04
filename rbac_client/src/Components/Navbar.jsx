import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";


const Navbar = () => {
  const {user,signOutUser}=useContext(AuthContext);

const handleSignOut = () => {
  signOutUser().catch(error => console.log(error));
};
    return (
      <div className="navbar bg-base-100  text-white"
      style={{ background: "linear-gradient(90deg, rgba(83, 67, 116, 1) 5%, rgba(11, 60, 125, 1) 80%)" }}
      >
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content  bg-gray-500 rounded-box z-1 mt-3 w-75 p-2 shadow">
        <li><Link to="/" className="text-xl font-semibold font-[raleway]">Home</Link></li>
       {
          user?<li><Link className="text-xl font-semibold font-[raleway]">{user?.email}</Link></li>:<li><Link to="/login" className="text-xl font-semibold font-[raleway]">Login</Link></li>
        }
         {
           user?<li><Link to="/dashBoard" className="text-xl font-semibold font-[raleway]">DashBoard</Link></li>:<></>
        }
      </ul>
    </div>
<a className="btn btn-ghost text-xl font-[raleway] bg-gradient-to-r from-blue-400 via-teal-300 to-yellow-400 bg-clip-text text-transparent">
  CareerWave
</a>


  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
       <li><Link to="/" className="text-xl font-semibold font-[raleway]">Home</Link></li>
        {
          user?<li><Link className="text-xl font-semibold font-[raleway]">{user?.email}</Link></li>:<li><Link to="/login" className="text-xl font-semibold font-[raleway]">Login</Link></li>
        }
        {
           user?<li><Link to="/dashBoard" className="text-xl font-semibold font-[raleway]">DashBoard</Link></li>:<></>
        }
  
    </ul>
  </div>
  <div className="navbar-end">
    {
      user && <button onClick={handleSignOut} className="btn btn-outline btn-warning font-[raleway]">Sign Out</button>
    }
  </div>
</div>
    );
};

export default Navbar;