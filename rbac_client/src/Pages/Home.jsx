import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import JobList from "../Components/JobList/JobList";



const Home = () => {
    const {loading}=useContext(AuthContext);
    if(loading){
        return <progress className="progress w-56"></progress>
    }
    return (
        <div style={{ background: "linear-gradient(90deg, rgba(83, 67, 116, 1) 5%, rgba(11, 60, 125, 1) 80%)" }}>

            <JobList></JobList>
           
        </div>
    );
};

export default Home;