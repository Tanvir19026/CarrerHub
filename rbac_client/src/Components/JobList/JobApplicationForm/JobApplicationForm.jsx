import DatePicker from "react-datepicker";
import { useContext, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";

const JobApplicationForm = ({ job }) => {
  const [startDate, setStartDate] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const { user } = useContext(AuthContext);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    if (!job || !job._id) {
      Swal.fire({
        icon: "error",
        title: "Job data not loaded yet",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!startDate) {
      Swal.fire({
        icon: "error",
        title: "Please select interview date",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (!resumeFile) {
      Swal.fire({
        icon: "error",
        title: "Please upload your resume",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const selectedDate = startDate.toISOString().split("T")[0];

    // Build metadata object
    const jobInfo = {
      jobId: job._id,
      jobTitle: job.jobTitle,
      name: e.target.name.value,
      address: e.target.address.value,
      phoneNumber: e.target.phoneNumber.value,
      experience: e.target.experience.value,
      interviewDate: selectedDate,
      applicantEmail: user?.email,
      status: "pending",
    };

    // FormData for file + metadata
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("metadata", JSON.stringify(jobInfo));

    try {
      const res = await axios.post("http://localhost:5000/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.insertedId || res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Application Sent Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        e.target.reset();
        setStartDate(null);
        setResumeFile(null);
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.message || "Submission failed",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
  <div className="w-11/12 max-w-5xl mx-auto py-12">
  <p className="text-white text-lg font-semibold mb-6 text-center">
    Please Submit this Application Form
  </p>

  <form onSubmit={handleApplicationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column */}
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-white font-medium">What is your name?</legend>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-user"></i>
          </span>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            required
            className="w-full pl-10 p-3 rounded-2xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 shadow-inner focus:outline-none"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-white font-medium">Address?</legend>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-map-marker-alt"></i>
          </span>
          <input
            type="text"
            name="address"
            placeholder="Type here"
            required
            className="w-full pl-10 p-3 rounded-2xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 shadow-inner focus:outline-none"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-white font-medium">Phone Number</legend>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-phone"></i>
          </span>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Type here"
            required
            className="w-full pl-10 p-3 rounded-2xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 shadow-inner focus:outline-none"
          />
        </div>
      </fieldset>
    </div>

    {/* Right Column */}
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-white font-medium">Experience</legend>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <i className="fas fa-briefcase"></i>
          </span>
          <input
            type="number"
            name="experience"
            placeholder="Type here"
            required
            className="w-full pl-10 p-3 rounded-2xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 shadow-inner focus:outline-none"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-white font-medium">Upload Resume</legend>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="w-full p-3 rounded-2xl bg-gray-900 text-white border border-gray-700 shadow-inner focus:outline-none"
        />
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-white font-medium">Select Date for Interview</legend>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Choose a date"
          className="w-full p-3 rounded-2xl bg-gray-900 text-white placeholder-gray-400 border border-gray-700 shadow-inner focus:outline-none"
        />
      </fieldset>
    </div>

    {/* Submit Button */}
    <div className="mt-6 col-span-full flex justify-center">
      <input
        type="submit"
        value="Submit"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold py-3 px-8 rounded-2xl shadow-md shadow-purple-700/50 cursor-pointer"
      />
    </div>
  </form>
</div>

  );
};

export default JobApplicationForm;
