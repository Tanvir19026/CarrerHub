import { createBrowserRouter } from "react-router-dom";
import MainLayOut from "../Components/Layout/MainLayOut";
import Home from "../Pages/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import JobDetails from "../Components/JobList/JobDetails/JobDetails";
import Profile from "../Pages/Profile";
import Application_applicant from "../Components/ApplicationListAs_Applicant/Application_applicant";
import UpdateApplication from "../Pages/UpdateApplication";
import DashBoardLayout from "../Components/Layout/DashBoardLayout";
import AddJobForm from './../Pages/AddJobForm';
import Recruiter from "../Components/Recruiter/Recruiter";
import EditJobDescriptions from "../Components/Recruiter/EditJobDescriptions";
import ViewApplicantInfo from "../Components/Recruiter/ViewApplicantInfo";
import RecruiterList from "../Components/Admin/RecruiterList";
import ApplicanList from "../Components/Admin/ApplicanList";

const router = createBrowserRouter([
  // ------------------ Main Layout Routes ------------------
  {
    path: "/",
    element: <MainLayOut />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/jobs/:id",
        element: <JobDetails />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/jobs/${params.id}`),
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/applicationbyapplicant",
        element: <Application_applicant />,
      },
      
      
    ],
  },

  // ------------------ Dashboard Layout Routes ------------------
  {
    path: "/dashboard",
    element: <DashBoardLayout />,
    children: [
      {
        path: "profile", // becomes /dashboard/profile
        element: <Profile />,
      },
      {
        path: "applicationbyapplicant", // becomes /dashboard/applications
        element: <Application_applicant />,
      },
      {
        path: "addjob", // optional
        element: <AddJobForm />,
      },
      
      {
        path:"mypublishedjob",
        element:<Recruiter></Recruiter>
      },
       {
        path:"updatejobdescription/:id",
        element:<EditJobDescriptions></EditJobDescriptions>,
        loader:({params})=>fetch(`http://localhost:5000/jobs/${params.id}`)
      },
      {
        path:"viewapplicants/:id",
        element:<ViewApplicantInfo></ViewApplicantInfo>,
        
      },

      {
          
        path:"recrutierlist",
        element:<RecruiterList></RecruiterList>,

      },
          {
          
        path:"applicantlist",
        element:<ApplicanList></ApplicanList>,

      },


      {
        path: "updateapplication/:id",
        element: <UpdateApplication />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/applications/${params.id}`),
      },
     
    ],
  },
]);

export default router;
