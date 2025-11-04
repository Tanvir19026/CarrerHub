import axios from "axios";



const baseURL="http://localhost:5000";

export const addJobApi=async(jobData)=>{
    try{
        const res=await axios.post(`${baseURL}/jobs`,jobData);
        return res.data;
    }
    catch(error){
        console.log("Error in adding job:",error);
        throw error;
    }
    
};

export const getJobsApi=async()=>{
    try{
        const response=await axios.get(`${baseURL}/jobs`);
        return response.data;
    }
    catch(error){
        console.log("Error in fetching jobs:",error);
        throw error;
    }
}