import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const resumeFileRef = useRef(null);

  const [formData, setFormData] = useState({
    jobTitle: "",
    name: "",
    address: "",
    phoneNumber: "",
    experience: "",
    interviewDate: "",
    applicantEmail: "",
    resumeUrl: "",
  });

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/applications/${id}`, {
          withCredentials: true,
        });
        const data = res.data;

        setFormData({
          jobTitle: data.jobTitle || "",
          name: data.name || "",
          address: data.address || "",
          phoneNumber: data.phoneNumber || "",
          experience: data.experience || "",
          interviewDate: data.interviewDate?.slice(0, 10) || "",
          applicantEmail: data.applicantEmail || "",
          resumeUrl: data.resumeUrl || "",
        });
      } catch (error) {
        console.error("Error fetching application:", error);
        Swal.fire("Error", "Failed to load application details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const file = resumeFileRef.current?.files?.[0];
      let response;

      if (file) {
        // If file is uploaded
        const data = new FormData();
        for (let key in formData) {
          data.append(key, formData[key]);
        }
        data.append("resume", file);

        response = await axios.patch(
          `http://localhost:5000/applications/${id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
      } else {
        // No file, normal JSON patch
        response = await axios.patch(
          `http://localhost:5000/applications/${id}`,
          formData,
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Application updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard/applicationbyapplicant");
      } else {
        Swal.fire("Warning", response.data.message || "Update failed", "warning");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Something went wrong while updating", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-400 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-600">
          Update Application Info
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              name="jobTitle"
              defaultValue={formData.jobTitle}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter job title"
              readOnly
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Applicant Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Experience (Years)</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter experience"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Applicant Email</label>
            <input
              type="email"
              name="applicantEmail"
              value={formData.applicantEmail}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter email"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Current Resume</label>
            {formData.resumeUrl ? (
              <a
                href={`http://localhost:5000${formData.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Current Resume
              </a>
            ) : (
              <p className="text-gray-500 italic">No resume uploaded</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Upload New Resume (optional)</label>
            <input
              type="file"
              ref={resumeFileRef}
              accept=".pdf,.doc,.docx"
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="md:col-span-2 mt-6 flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full md:w-1/2 text-white"
            >
              {saving ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Update Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateApplication;
