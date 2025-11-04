import {  useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import JobApplicationForm from "../JobApplicationForm/JobApplicationForm";


const JobDetails = () => {
  const {id}=useParams(); 
  const [job,setJobs]=useState([]);
  const [loader,setLoader]=useState(true);

  useEffect(()=>{
    const result=axios.get(`http://localhost:5000/jobs/${id}`);
    result.then(res=>setJobs(res.data));
    setLoader(false);
  },[])
  console.log(job)

  if(loader){
    return <progress className="progress w-56"></progress>
  }
  
    return (
     <div className="w-11/12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
  {/* Left Card - Job Info */}
   <div className="relative bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white rounded-3xl p-8 shadow-neumorphism border border-gray-700">
    <h3 className="text-3xl font-bold mb-6 drop-shadow-lg">{job.jobTitle}</h3>
    
    <p className="text-lg mb-3">
      <span className="font-semibold">Company:</span> {job.companyName}
    </p>
    <p className="text-lg mb-3">
      <span className="font-semibold">Salary:</span> {job.minSalary} - {job.maxSalary} {job.currency}
    </p>
    <p className="text-lg">
      <span className="font-semibold">Requirements:</span> {job?.requirements?.join(", ")}
    </p>
  </div>
  {/* Right Card - Application Form */}
  <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-3xl p-8 shadow-2xl border border-gray-700">
    {/* Decorative animated blur circle */}
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-200"></div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-blob animation-delay-400"></div>

    <JobApplicationForm job={job} />
  </div>
</div>

    );
};

export default JobDetails;