import { createContext, useEffect, useState } from "react";
import { addJobApi, getJobsApi } from "../API/Api";


export const ApiContext = createContext();

export const ApiProvider = ({children}) => {

const [jobs,setJobs]=useState([]);
const[loading,setLoading]=useState(true);

const api={
    addJobApi,
    getJobsApi,
    jobs
}

const fetchData=async()=>{

try{
    const data=await getJobsApi();
    setJobs(data);
    setLoading(false);
}
catch(error){
    console.log("Error in fetching jobs:",error);
}

useEffect(()=>{
    fetchData();
},[])


}
return (
    <ApiContext.Provider value={api}>
        {children}
    </ApiContext.Provider>
)


}