import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit2, FiX } from "react-icons/fi";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState([]);
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const admin = import.meta.env.VITE_ADMIN_EMAIL;

  // ✅ Fetch user info
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`http://localhost:5000/users?email=${user?.email}`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserInfo(res.data);
        if (res.data?.[0]?.role) {
          setRole(res.data[0].role);
        } else if (user?.email === admin) {
          // auto-assign admin role if not already set
          setRole("admin");
          handleRoleChange("admin", res.data[0]?._id);
        }
      })
      .catch((err) => console.log(err));
  }, [user?.email]);

  // ✅ Handle role change and backend update
  const handleRoleChange = async (selectedRole, userIdParam) => {
    try {
      const userId = userIdParam || userInfo[0]?._id;
      if (!userId) return;

      // prevent admin from being changed
      if (user?.email === admin) {
        selectedRole = "admin";
      }

      await axios.patch(
        `http://localhost:5000/users/${userId}/role`,
        { role: selectedRole },
        { withCredentials: true }
      );

      setUserInfo((prev) => {
        const updated = [...prev];
        if (updated[0]) updated[0].role = selectedRole;
        return updated;
      });

      setRole(selectedRole);
      setIsEditing(false);

      Swal.fire({
        title: "Success!",
        text: `Your role has been updated to ${selectedRole}.`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update role.",
        icon: "error",
      });
    }
  };

  // ❌ Remove role (except admin)
  const handleClearRole = async () => {
    if (user?.email === admin) {
      Swal.fire("Error", "Admin role cannot be removed!", "error");
      return;
    }

    try {
      const userId = userInfo[0]?._id;
      if (!userId) return;

      await axios.patch(
        `http://localhost:5000/users/${userId}/role`,
        { role: "" },
        { withCredentials: true }
      );

      setUserInfo((prev) => {
        const updated = [...prev];
        if (updated[0]) updated[0].role = "";
        return updated;
      });

      setRole("");
      setIsEditing(true);
    } catch (error) {
      console.error("Failed to clear role:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  const currentUser = userInfo?.[0];

  return (
    <>
      {user && currentUser ? (
        <div className="min-h-screen w-full flex justify-center items-center p-6 bg-gradient-to-r from-[#2f2543] via-[#0d294f] to-[#2f2543] text-white">
          <div className="grid grid-cols-1 gap-8 justify-items-center w-full max-w-3xl">

            <h1 className="text-4xl lg:text-5xl font-bold text-center">
              Build Your Dream Career
            </h1>

            <div className="bg-gray-800/80 text-white w-80 shadow-2xl rounded-2xl p-6 flex flex-col items-center">
              <img
                src={currentUser?.photoUrl}
                alt="User"
                className="rounded-full w-32 h-32 object-cover border-4 border-white mb-4"
              />

              <h2 className="text-xl font-bold">{currentUser?.name}</h2>
              <p className="text-sm mt-2">{currentUser?.email}</p>

              {/* Role Section */}
              <div className="mt-5 w-full text-center">
                {!isEditing && role ? (
                  <div className="flex flex-col gap-2 items-center">
                    <p className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                      Your Role: {role}
                    </p>

                    {user.email !== admin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                          title="Edit Role"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={handleClearRole}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-full"
                          title="Remove Role"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mb-2 text-gray-300 font-medium">
                      Select your role:
                    </p>
                    <select
                      value={role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
                      disabled={user.email === admin}
                    >
                      <option value="">Select Role</option>
                      <option value="Applicant">Applicant</option>
                      <option value="Recruiter">Recruiter</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <progress className="progress w-56"></progress>
        </div>
      )}
    </>
  );
};

export default Profile;
