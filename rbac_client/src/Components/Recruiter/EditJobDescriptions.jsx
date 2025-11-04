import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditJobDescriptions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    jobTitle: "",
    minSalary: "",
    maxSalary: "",
    currency: "BDT",
    requirements: "",
    jobImage: "",
  });

  // Fetch job by ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/jobs/${id}`, { withCredentials: true })
      .then((res) => {
        setJob(res.data);
        setFormData({
          companyName: res.data.companyName,
          companyEmail: res.data.companyEmail,
          jobTitle: res.data.jobTitle,
          minSalary: res.data.minSalary,
          maxSalary: res.data.maxSalary,
          currency: res.data.currency,
          requirements: res.data.requirements.join(", "),
          jobImage: res.data.jobImage,
        });
      })
      .catch((err) => console.error("Error fetching job:", err));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        jobTitle: formData.jobTitle,
        minSalary: formData.minSalary,
        maxSalary: formData.maxSalary,
        currency: formData.currency,
        requirements: formData.requirements.split(",").map((r) => r.trim()),
        jobImage: formData.jobImage,
      };

      const res = await axios.patch(
        `http://localhost:5000/jobs/${id}`,
        updatedData,
        { withCredentials: true }
      );

      if (res.data.modifiedCount || res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Job Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/mypublishedjob"); // go back to recruiter dashboard
      } else {
        throw new Error("You didn't make any changes.");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message || "Update failed",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (!job) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="w-11/12 md:w-2/3 mx-auto my-10 p-10 border rounded-lg bg-gray-900 text-white shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-400">
        Edit Job Description
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <label className="block">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            disabled
            className="input input-accent bg-gray-800 text-white"
          />

          <label className="block">Company Email</label>
          <input
            type="text"
            name="companyEmail"
            value={formData.companyEmail}
            disabled
            className="input input-accent bg-gray-800 text-white"
          />

          <label className="block">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="input input-accent bg-gray-800 text-white"
          />

          <label className="block">Min Salary</label>
          <input
            type="number"
            name="minSalary"
            value={formData.minSalary}
            onChange={handleChange}
            className="input input-accent bg-gray-800 text-white"
          />

          <label className="block">Max Salary</label>
          <input
            type="number"
            name="maxSalary"
            value={formData.maxSalary}
            onChange={handleChange}
            className="input input-accent bg-gray-800 text-white"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="block">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="select select-accent bg-gray-800 text-white"
          >
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="OTHERS">OTHERS</option>
          </select>

          <label className="block">Requirements (comma separated)</label>
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="input input-accent bg-gray-800 text-white"
          />

          <label className="block">Job Image URL</label>
          <input
            type="text"
            name="jobImage"
            value={formData.jobImage}
            onChange={handleChange}
            className="input input-accent bg-gray-800 text-white"
          />

          {formData.jobImage && (
            <img
              src={formData.jobImage}
              alt="Job"
              className="mt-4 w-full h-48 object-contain rounded-lg border border-gray-700"
            />
          )}
        </div>

        <div className="col-span-full flex justify-center mt-6">
          <button
            type="submit"
            className="btn btn-success px-8 py-3 font-bold text-white rounded-xl bg-green-600 hover:bg-green-700 transition-all"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobDescriptions;
