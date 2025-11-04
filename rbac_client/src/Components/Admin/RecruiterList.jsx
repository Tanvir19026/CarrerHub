import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const RecruiterList = () => {
  const [recruiter, setRecruiter] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const email = user?.email;
  const admin = import.meta.env.VITE_ADMIN_EMAIL;

  // ✅ Fetch all recruiters (only for admin)
  useEffect(() => {
    if (email === admin) {
      const token = localStorage.getItem("access-token");
      axios
        .get("http://localhost:5000/recruiters", {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => {
          setRecruiter(res.data);

          // Prepare chart data
          const countByDate = {};
          res.data.forEach((rec) => {
            const date = new Date(rec.createdAt).toLocaleDateString();
            countByDate[date] = (countByDate[date] || 0) + 1;
          });
          const data = Object.entries(countByDate).map(([date, count]) => ({
            date,
            count,
          }));
          setChartData(data);
        })
        .catch((err) => console.error(err.response?.data || err));
    }
  }, [email, admin]);

  // ✅ Handle delete recruiter
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This recruiter will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("access-token");
        await axios.delete(`http://localhost:5000/recruiters/${id}`, {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setRecruiter((prev) => prev.filter((a) => a._id !== id));

        Swal.fire("Deleted!", "The recruiter has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete recruiter.", "error");
      }
    }
  };

  if (loading) {
    return <progress className="progress w-56"></progress>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2b3a55] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Recruiter List : {recruiter.length}
        </h2>

        {/* Chart Section */}
        <div className="mb-8 bg-gray-800/70 p-4 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Recruiters Created Over Time</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "white", fontSize: 12 }} />
                <YAxis tick={{ fill: "white", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
                <Legend wrapperStyle={{ color: "white" }} />
                <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center">No data to display</p>
          )}
        </div>

        {recruiter.length === 0 ? (
          <p className="text-center text-gray-400">No recruiter found.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-800/70 rounded-2xl shadow-xl">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-700 text-left text-gray-200">
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Created On</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recruiter.map((rec, idx) => (
                  <tr
                    key={rec._id}
                    className={`border-t border-gray-700 ${
                      idx % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"
                    } hover:bg-gray-700/70 transition`}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={rec.photoUrl}
                        alt={rec.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold">{rec.name}</td>
                    <td className="px-4 py-3 text-gray-300">{rec.email}</td>
                    <td className="px-4 py-3">{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(rec._id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition"
                        title="Delete recruiter"
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

export default RecruiterList;
