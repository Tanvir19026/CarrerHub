import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ViewApplicantInfo = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loadingScores, setLoadingScores] = useState({}); // Track which resume is being scored

  // Fetch all applications for this job
  useEffect(() => {
    axios
      .get("http://localhost:5000/applications", { withCredentials: true })
      .then((res) => {
        const filtered = res.data.filter((app) => app.jobId === id);
        setApplicants(filtered);

        // Trigger scoring for each resume
        filtered.forEach((app) => fetchResumeScore(app._id, app.resumeUrl));
      })
      .catch((err) => console.error("Error fetching applications:", err));
  }, [id]);

  // Function to fetch AI resume score
  const fetchResumeScore = async (appId, resumeUrl) => {
    setLoadingScores((prev) => ({ ...prev, [appId]: true }));

    try {
      const res = await axios.post(
        "http://localhost:5000/ai/score-resume",
        { resumeUrl },
        { withCredentials: true }
      );

      const score = res.data.score !== null ? res.data.score : "N/A";

      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, resumeScore: score } : a))
      );
    } catch (err) {
      console.error("Error scoring resume:", err);
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, resumeScore: "N/A" } : a))
      );
    } finally {
      setLoadingScores((prev) => ({ ...prev, [appId]: false }));
    }
  };

  // Handle status update
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/applications/${appId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.modifiedCount || res.data.success) {
        setApplicants((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
        Swal.fire({
          icon: "success",
          title: "Status updated",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update status",
        text: err.message,
      });
    }
  };

  if (!applicants.length)
    return <p className="text-white text-center mt-10">No applicants yet</p>;

  return (
    <div className="w-11/12 max-w-5xl mx-auto my-10 p-6 bg-gray-800 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Applicants ({applicants.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-700/80 text-gray-200 uppercase text-sm">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">Resume</th>
              <th className="px-4 py-2">Resume Score</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-600 text-gray-100">
            {applicants.map((app) => (
              <tr key={app._id} className="hover:bg-gray-700/50 transition-all">
                <td className="px-4 py-2">{app.name}</td>
                <td className="px-4 py-2">{app.applicantEmail}</td>
                <td className="px-4 py-2">{app.phoneNumber}</td>
                <td className="px-4 py-2">{app.experience} yrs</td>
                <td className="px-4 py-2">
                  <a
                    href={`http://localhost:5000${app.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    View Resume
                  </a>
                </td>
                <td className="px-4 py-2">
                  {loadingScores[app._id]
                    ? "Scoring..."
                    : app.resumeScore !== undefined
                    ? app.resumeScore
                    : "-"}
                </td>
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
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(app._id, "approved")}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "rejected")}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplicantInfo;
