import { Outlet, NavLink } from "react-router-dom";
import { FaUser, FaFileAlt, FaHome ,FaListUl  } from "react-icons/fa";
import { MdAddLink } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

const ApplicantLayout = () => {
  const { user,loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const role = users[0]?.role;
  const admin_email=import.meta.env.VITE_ADMIN_EMAIL;
  console.log(admin_email)

  // 🧠 Re-fetch user every few seconds or when window refocuses
  const fetchUser = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/users?email=${user.email}`,
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUser();
  }, [user?.email]);

  // 🕒 Re-fetch automatically every 5 seconds (in case of role change)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUser();
    }, 5000); // check every 5s
    return () => clearInterval(interval);
  }, [user?.email]);

  // 🔄 Also re-fetch when window/tab regains focus
  useEffect(() => {
    const handleFocus = () => fetchUser();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.email]);
  if(loading)
  {
    return <progress className="progress w-56"></progress>
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      {/* Left Sidebar */}
      <aside className="lg:w-1/5 w-full bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6"><span className="text-amber-400">{role?.toUpperCase()}</span> Dashboard</h2>

      {
        !role && (
          <nav className="flex flex-col gap-4">
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 text-blue-400 font-semibold"
                  : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
              }
            >
              <FaUser /> Profile
            </NavLink>
          </nav>
        )
       }


          {role === "Applicant" && (
            <nav className="flex flex-col gap-4">
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaUser /> Profile
              </NavLink>
              <NavLink
                to="applicationbyapplicant"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaFileAlt /> My Applications
              </NavLink>
            </nav>
          )}
          {user?.email === admin_email && (
            <nav className="flex flex-col gap-4">
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaUser /> Profile
              </NavLink>

              <NavLink
                to="recrutierlist"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaFileAlt /> Recruiter List
              </NavLink>

                 <NavLink
                to="applicantlist"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaFileAlt /> Applicant List
              </NavLink>





            </nav>
          )}

          {role === "Recruiter" && (
            <nav className="flex flex-col gap-4">
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaUser /> Profile
              </NavLink>
              <NavLink
                to="mypublishedjob"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <FaListUl  className="text-[15px]"/> My Published Job Circulars
              </NavLink>

              <NavLink
                to="addjob"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 text-blue-400 font-semibold"
                    : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
                }
              >
                <MdAddLink className="text-[20px]" /> Add Job Circular
              </NavLink>
            </nav>
          )}
        </div>

        {/* Go Home Link */}
        <div className="mt-4 md:mb-[60px]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-3 text-blue-400 font-semibold"
                : "flex items-center gap-3 text-gray-300 hover:text-blue-300 transition"
            }
          >
            <FaHome /> Go Home
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ApplicantLayout;
