import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Recruiter = () => {
  const { user } = useContext(AuthContext);
  const [joblist, setJoblist] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const STATUS_COLORS = {
    pending: "#facc15",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  // Fetch recruiter jobs first
  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/jobs/email/${user.email}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJoblist(res.data);
      })
      .catch((err) => console.error(err));
  }, [user?.email]);

  // Fetch applications after jobs are loaded
  useEffect(() => {
    if (joblist.length === 0) {
      setApplications([]);
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/applications", { withCredentials: true })
      .then((res) => {
        // only include applications for recruiter jobs
        const myApps = res.data.filter((app) =>
          joblist.some((job) => job._id === app.jobId)
        );
        setApplications(myApps);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [joblist]);

  // Delete Job
  const handleDelete = async (jobId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the job post.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
        withCredentials: true,
      });
      setJoblist(joblist.filter((j) => j._id !== jobId));
      // also remove related applications
      setApplications(applications.filter((a) => a.jobId !== jobId));
      Swal.fire("Deleted!", "Job post has been deleted.", "success");
    } catch {
      Swal.fire("Error", "Failed to delete job post.", "error");
    }
  };

  const getApplicants = (jobId) =>
    applications.filter((a) => a.jobId === jobId);

  // Charts data
  const applicationsPerJob = joblist.map((job) => {
    const apps = getApplicants(job._id);
    const statusCount = { pending: 0, approved: 0, rejected: 0 };
    apps.forEach((a) => {
      if (statusCount[a.status] !== undefined) statusCount[a.status]++;
    });
    return { jobTitle: job.jobTitle, total: apps.length, ...statusCount };
  });

  const statusPieData = Object.entries(
    applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    )
  ).map(([name, value]) => ({ name, value }));

  if (loading)
    return <progress className="progress w-56 mx-auto mt-20"></progress>;

 
return (
  <div className="w-full min-h-[90vh] p-4 bg-gray-900/90 flex flex-col items-center">
    <div className="w-full max-w-[1400px] bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-8">

      {/* Top Charts Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Applications Status Pie */}
        <div className="flex-1 bg-[rgba(31,41,55,0.7)] rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl text-white font-bold mb-4">Applications Status</h3>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} formatter={(value, name) => [value, name]} />
                <Legend wrapperStyle={{ color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No applications found.</p>
          )}
        </div>

        {/* Total Applicants Pie */}
        <div className="flex-1 bg-[rgba(31,41,55,0.7)] rounded-xl p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl text-white font-bold mb-4">Total Applicants</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[{ name: "Total Applicants", value: applications.length }]}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                <Cell fill="rgba(74,222,128,0.8)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-white mt-2 text-lg font-semibold">
            {applications.length} Applicants
          </div>
        </div>
      </div>

      {/* Applications per Job Bar */}
      <div className="flex-1 bg-gray-800/70 rounded-xl p-4 shadow-md mb-6 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl text-white font-bold mb-4">Applications per Job</h3>
        {applicationsPerJob.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationsPerJob} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#555" strokeDasharray="3 3" />
              <XAxis dataKey="jobTitle" tick={{ fill: "white", fontSize: 12 }} />
              <YAxis tick={{ fill: "white", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "white" }} />
              <Legend wrapperStyle={{ color: "white" }} />
              <Bar dataKey="pending" stackId="a" fill={STATUS_COLORS.pending} />
              <Bar dataKey="approved" stackId="a" fill={STATUS_COLORS.approved} />
              <Bar dataKey="rejected" stackId="a" fill={STATUS_COLORS.rejected} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">No applications found.</p>
        )}
      </div>

      {/* Jobs Table */}
      <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">
        My Posted Jobs ({joblist.length})
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-inner shadow-gray-700">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-700/80 text-gray-200 uppercase text-sm">
            <tr>
              <th className="px-4 py-2">Job ID</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Applicants</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600 text-gray-100">
            {joblist.map((job) => {
              const jobApplicants = getApplicants(job._id);
              return (
                <tr key={job._id} className="hover:bg-gray-700/50 transition-all duration-300">
                  <td className="px-4 py-2 text-gray-300">{job._id}</td>
                  <td className="px-4 py-2 font-medium text-white">{job.companyName}</td>
                  <td className="px-4 py-2">{job.jobTitle}</td>
                  <td className="px-4 py-2">{job.minSalary}-{job.maxSalary} {job.currency}</td>
                  <td className="px-4 py-2">
                    {jobApplicants.length > 0 ? (
                      <span className="text-green-400 font-semibold">{jobApplicants.length} Applied</span>
                    ) : (
                      <span className="text-gray-400">No Applicants</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-3">
                    <button
                      onClick={() => navigate(`/dashboard/updatejobdescription/${job._id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-2 rounded-lg shadow-md transition-all"
                      title="Edit Job"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/viewapplicants/${job._id}`)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition-all"
                      title="View Applicants"
                    >
                      <FaUsers />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition-all"
                      title="Delete Job"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

};

export default Recruiter;
