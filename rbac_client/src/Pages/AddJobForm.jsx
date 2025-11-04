import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Swal from "sweetalert2";
import { ApiContext } from "../Context/ApiContext";
import { FaBuilding, FaEnvelope, FaBriefcase, FaMoneyBill, FaList, FaImage } from "react-icons/fa";

const AddJobForm = () => {
  const { user } = useContext(AuthContext);
  const { addJobApi } = useContext(ApiContext);

  const handleAddJobSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const requirements = data.Requirements.split(",").map((r) => r.trim());
    const jobData = {
      companyName: data.CompanyName,
      companyEmail: data.cemail,
      jobTitle: data.JobTitle,
      minSalary: data.minSalary,
      maxSalary: data.maxSalary,
      currency: data.currency,
      requirements,
      jobImage: data["Job-Image"],
    };

    try {
      const response = await addJobApi(jobData);
      if (response.insertedId) {
        Swal.fire({
          icon: "success",
          title: "🎉 Job Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add job. Please try again.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }

    form.reset();
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-400 mb-10">
          <FaBriefcase className="inline-block mr-2 text-orange-400" />
          Job Post Details
        </h1>

        <form onSubmit={handleAddJobSubmit} className="space-y-6">
          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                <FaBuilding className="inline mr-2 text-orange-400" />
                Company Name
              </label>
              <input
                type="text"
                name="CompanyName"
                placeholder="e.g. Google"
                required
                className="w-full input input-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                <FaEnvelope className="inline mr-2 text-orange-400" />
                Company Email
              </label>
              <input
                type="text"
                name="cemail"
                value={user?.email}
                readOnly
                className="w-full input input-bordered bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Job Info */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              <FaBriefcase className="inline mr-2 text-orange-400" />
              Job Title
            </label>
            <input
              type="text"
              name="JobTitle"
              placeholder="e.g. Frontend Developer"
              required
              className="w-full input input-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
            />
          </div>

          {/* Salary Section */}
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              <FaMoneyBill className="inline mr-2 text-orange-400" />
              Salary Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="minSalary"
                placeholder="Min Salary"
                required
                className="input input-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              />
              <input
                type="number"
                name="maxSalary"
                placeholder="Max Salary"
                required
                className="input input-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              />
              <select
                name="currency"
                defaultValue=""
                required
                className="select select-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              >
                <option value="" disabled>
                  Select Currency
                </option>
                <option>BDT</option>
                <option>USD</option>
                <option>OTHERS</option>
              </select>
            </div>
          </div>

          {/* Requirements & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                <FaList className="inline mr-2 text-orange-400" />
                Requirements
              </label>
              <input
                type="text"
                name="Requirements"
                placeholder="React, Node, JavaScript..."
                required
                className="w-full input input-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate each skill with a comma
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                <FaImage className="inline mr-2 text-orange-400" />
                Job Image URL
              </label>
              <input
                type="text"
                name="Job-Image"
                placeholder="https://example.com/image.jpg"
                required
                className="w-full input input-bordered bg-gray-800 border-gray-700 text-white focus:border-orange-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button
              type="submit"
              className="btn bg-orange-500 hover:bg-orange-600 border-none text-white font-bold text-lg px-10 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
            >
              Submit Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;
