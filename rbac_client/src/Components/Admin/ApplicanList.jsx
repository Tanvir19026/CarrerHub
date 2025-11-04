import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const email = user?.email;
  const admin = import.meta.env.VITE_ADMIN_EMAIL;

  // ✅ Fetch applicants
  useEffect(() => {
    if (email === admin) {
      const token = localStorage.getItem("access-token");
      axios
        .get("http://localhost:5000/applicants", {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setApplicants(res.data))
        .catch((err) => console.error(err.response?.data || err));
    }
  }, [email, admin]);

  // ✅ Handle delete applicant
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This applicant will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("access-token");
        await axios.delete(`http://localhost:5000/applicants/${id}`, {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setApplicants((prev) => prev.filter((a) => a._id !== id));
        Swal.fire("Deleted!", "The applicant has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete applicant.", "error");
      }
    }
  };

  // ✅ Chart Data: group applicants by date
  const chartData = Object.values(
    applicants.reduce((acc, applicant) => {
      const date = new Date(applicant.createdAt).toLocaleDateString();
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count++;
      return acc;
    }, {})
  );

  if (loading) {
    return <progress className="progress w-56"></progress>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2b3a55] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">
          Applicant List : {applicants.length}
        </h2>

        {/* 📊 Chart Section */}
        <div className="bg-gray-800/70 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Applicants by Date
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2b2b3a",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Bar dataKey="count" fill="#60a5fa" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🧍 Applicant Table */}
        {applicants.length === 0 ? (
          <p className="text-center text-gray-400">No applicants found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800/70 rounded-2xl shadow-xl">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-700 text-left text-gray-200">
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Applied On</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant, idx) => (
                  <tr
                    key={applicant._id}
                    className={`border-t border-gray-700 ${
                      idx % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"
                    } hover:bg-gray-700/70 transition`}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={applicant.photoUrl}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold">{applicant.name}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {applicant.email}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(applicant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(applicant._id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition"
                        title="Delete Applicant"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantList;
