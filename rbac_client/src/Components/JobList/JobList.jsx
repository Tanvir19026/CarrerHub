import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../Context/ApiContext";
import Job from "./Job/Job";

const JobList = () => {
    const {getJobsApi}=useContext(ApiContext);
    const [jobs,setJobs]=useState([]);
    const[loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchData=async()=>{
            const data = await getJobsApi();
            setJobs(data);
            setLoading(false);
        }
        fetchData();

    },[getJobsApi])
    if(loading){
        return <progress className="progress w-56"></progress>
    }

    return (
        <div className="container mx-auto py-8 ">
            <p className="text-3xl font-bold mb-6 text-white ps-5" >Available Jobs</p>
            <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-center">
                {
                    jobs.map(job=><Job job={job} key={job._id}></Job>)
                }

            </div>
        </div>
    );
};

export default JobList;