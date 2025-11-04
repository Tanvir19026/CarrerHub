import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate=useNavigate();
  const {
    _id,
    companyName,
    jobTitle,
    minSalary,
    maxSalary,
    currency,
    requirements,
    jobImage,
  } = job;


 



  return (
    <div className="relative mt-6 w-96 bg-gray-900/70 shadow-2xl rounded-2xl border border-gray-700 overflow-hidden transform hover:scale-105 transition duration-500 hover:shadow-3xl m-4">
  
  {/* Job Image */}
  <div className="relative overflow-hidden rounded-t-2xl">
    <img
      className="w-full h-48 object-cover transition-transform duration-500 transform hover:scale-110"
      src={jobImage}
      alt={jobTitle}
    />
    {/* Overlay effect */}
    <div className="absolute  bg-black/25"></div>
  </div>

  {/* Card Body */}
  <div className="p-6 flex flex-col gap-2">
    {/* Job Title */}
    <h2 className="text-xl font-bold text-white truncate animate-fadeInUp">
      {jobTitle}
    </h2>

    {/* Company */}
    <h3 className="text-sm text-gray-300">Company: {companyName}</h3>

    {/* Salary */}
    <h3 className="text-sm text-gray-300">
      Salary Range: {minSalary} - {maxSalary} {currency}
    </h3>

    {/* Requirements */}
    <div className="flex flex-wrap mt-2 gap-2">
      {requirements.map((req, index) => (
        <span
          key={index}
          className="bg-green-500 text-green-900 px-3 py-1 rounded-full text-lg font-semibold animate-pulse"
        >
          {req}
        </span>
      ))}
    </div>

    {/* Action Button */}
    <div className="mt-4">
      <Link
        to={`/jobs/${_id}`}
        className="inline-block bg-orange-500/80 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-full transition duration-300 shadow-md hover:shadow-lg"
      >
        View Details
      </Link>
    </div>
  </div>

  {/* Decorative Animated Background Glow */}
  <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full opacity-30 blur-2xl animate-blob animation-delay-200"></div>
  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-30 blur-2xl animate-blob animation-delay-400"></div>
</div>

  );
};

export default Job;
