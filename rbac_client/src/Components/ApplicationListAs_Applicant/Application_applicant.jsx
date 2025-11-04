import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const Application_applicant = () => {
  const [applications, setApplications] = useState([]);
  const [jobsMap, setJobsMap] = useState({});
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const STATUS_COLORS = {
    pending: "#facc15", // yellow
    approved: "#22c55e", // green
    rejected: "#ef4444", // red
  };

  useEffect(() => {
    if (!user?.email) return;

    // Fetch user applications
    axios
      .get(`http://localhost:5000/applications?email=${user.email}`, { withCredentials: true })
      .then((res) => {
        setApplications(res.data);

        // Fetch job details
        res.data.forEach((app) => {
          if (!jobsMap[app.jobId]) {
            axios
              .get(`http://localhost:5000/jobs/${app.jobId}`)
              .then((jobRes) => {
                setJobsMap((prev) => ({ ...prev, [app.jobId]: jobRes.data }));
              })
              .catch((err) => console.log(err));
          }
        });
      })
      .catch((err) => console.log(err));
  }, [user?.email]);

  const handleDeleteApplication = (id) => {
    axios
      .delete(`http://localhost:5000/applications/${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Application deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          setApplications((prev) => prev.filter((app) => app._id !== id));
        } else {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // Prepare chart data
  const chartLineData = []; // applications over time
  const chartStatusData = { pending: 0, approved: 0, rejected: 0 };
  const chartJobDataMap = {}; // applications per job

  applications.forEach((app) => {
    // 1️⃣ Line chart data
    const date = app.submittedAt?.slice(0, 10);
    const existing = chartLineData.find((d) => d.date === date);
    if (existing) existing.count += 1;
    else chartLineData.push({ date, count: 1 });

    // 2️⃣ Status data
    if (app.status in chartStatusData) chartStatusData[app.status] += 1;

    // 3️⃣ Applications per job
    const jobName = app.jobTitle;
    chartJobDataMap[jobName] = (chartJobDataMap[jobName] || 0) + 1;
  });

  const chartStatusArray = Object.entries(chartStatusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const chartJobArray = Object.entries(chartJobDataMap).map(([job, count]) => ({
    job,
    count,
  }));

  if (loading || !user?.email) return <progress className="progress w-56"></progress>;

  return (
    <div className="w-full min-h-[90vh] p-4 bg-gray-900/90 flex flex-col items-center">
      <div className="w-full max-w-[1400px] bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">
          My Applications ({applications.length})
        </h2>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart - Applications over time */}
          <div className="bg-gray-700/70 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-center text-white">Applications Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartLineData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "white", fontSize: 12 }} />
                <YAxis tick={{ fill: "white", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
                <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Status distribution */}
          <div className="bg-gray-700/70 p-4 rounded-2xl shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2 text-center text-white">Application Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartStatusArray} dataKey="value" nameKey="name" outerRadius={70} label>
                  {chartStatusArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "white" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Applications per job */}
          <div className="bg-gray-700/70 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-center text-white">Applications per Job</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartJobArray} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#555" strokeDasharray="3 3" />
                <XAxis dataKey="job" tick={{ fill: "white", fontSize: 12 }} />
                <YAxis tick={{ fill: "white", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
                <Legend wrapperStyle={{ color: "white" }} />
                <Bar dataKey="count" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto lg:overflow-x-visible rounded-lg shadow-inner shadow-gray-700">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-700/80 text-gray-200 uppercase text-sm">
              <tr>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Salary</th>
                <th className="px-4 py-2">Company Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Submitted Date</th>
                <th className="px-4 py-2 text-red-400">Interview Date</th>
                <th className="px-4 py-2">Resume</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600 text-gray-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-700/50 transition-all duration-300">
                  <td className="px-4 py-2 font-medium min-w-[120px]">{app.jobTitle}</td>
                  <td className="px-4 py-2 min-w-[120px]">{jobsMap[app.jobId]?.companyName || "Loading..."}</td>
                  <td className="px-4 py-2 min-w-[100px]">{jobsMap[app.jobId]?.minSalary}-{jobsMap[app.jobId]?.maxSalary} {jobsMap[app.jobId]?.currency}</td>
                  <td className="px-4 py-2 min-w-[150px]">{jobsMap[app.jobId]?.companyEmail}</td>
                  <td className="px-4 py-2 min-w-[120px]">{app?.phoneNumber}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        app.status === "pending"
                          ? "bg-yellow-500 text-gray-900"
                          : app.status === "approved"
                          ? "bg-green-500 text-gray-900"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 min-w-[120px]">{app.submittedAt?.slice(0, 10)}</td>
                  <td className="px-4 py-2 min-w-[120px] text-red-400">{app.interviewDate}</td>
                  <td className="px-4 py-2 min-w-[120px]">
                    <a
                      href={`http://localhost:5000${app.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline hover:text-blue-300"
                    >
                      View Resume
                    </a>
                  </td>
                  <td className="px-4 py-2 flex flex-col sm:flex-row gap-2 justify-start">
                    <button
                      onClick={() => navigate(`/dashboard/updateapplication/${app._id}`)}
                      className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg shadow-md hover:bg-yellow-500 transition-all"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteApplication(app._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Application_applicant;
