import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import StudentsDashboard from "./pages/studentsDashboard/StudentsDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import { useEffect, useState } from "react";
import CompanyRegister from "./pages/CompanyRegister/CompanyRegister";
import ViewCompanyRequest from "./pages/ViewCompanyRequest/ViewCompanyRequest";
import InternshipDetails from "./pages/InternshipDetails/InternshipDetails";
import InternshipApplicationPage from "./pages/InternshipApplicationPage/InternshipApplicationPage";
import CompanyViewPostings from "./pages/CompanyViewPostings/CompanyViewPostings";
import ApplicantDetails from "./pages/ApplicantDetails/ApplicantDetails";
import InitialCompanyUserData from "./data/InitialCompanyUsersData";
import InitialStudentData from "./data/InitialStudentData";
import InitialCompanyRequestsData from "./data/InitialCompanyRequestsData";

function App() {
  // this stores the current user logged in
  // it can be a student, scad user or company user
  const [currUser, setCurrUser] = useState(undefined);
  const [scadUsers, setScadUsers] = useState([
    { username: "scad", password: "1234" },
  ]);

  // this checks if there is data in local storage and sets the company users to that data
  // if there is no data in local storage, it sets the company users to the initial data JSON file

  //COMPANY STATE
  const [companyUsers, setCompanyUsers] = useState(() => {
    const saved = localStorage.getItem("companyUsers");
    return saved ? JSON.parse(saved) : InitialCompanyUserData;
  });

  useEffect(() => {
    localStorage.setItem("companyUsers", JSON.stringify(companyUsers));
  }, [companyUsers]);

  //STUDENT STATE
  const [studentUsers, setStudentUsers] = useState(() => {
    const saved = localStorage.getItem("studentUsers");
    return saved ? JSON.parse(saved) : InitialStudentData;
  });

  useEffect(() => {
    localStorage.setItem("studentUsers", JSON.stringify(studentUsers));
  }, [studentUsers]);

  //COMPANY REQUESTS STATE
  const [companyRequests, setCompanyRequests] = useState(() => {
    const saved = localStorage.getItem("companyRequests");
    return saved ? JSON.parse(saved) : InitialCompanyRequestsData;
  });

  useEffect(() => {
    localStorage.setItem("companyRequests", JSON.stringify(companyRequests));
  }, [companyRequests]);

  const [allInternships, setAllInternships] = useState([
    {
      id: 1,
      title: "Software Engineer Intern",
      companyName: "welloDev",
      location: "Remote",
      description:
        "We are looking for a Software Engineer Intern to join our team.",
      requirements: [
        "Strong knowledge of JavaScript",
        "Experience with React",
        "Good communication skills",
      ],
      paid: true,
      salary: 1000,
      duration: "3 months",
      status: "open",
      applications: [],
    },
    {
      id: 2,
      title: "Data Analyst Intern",
      companyName: "instabug",
      location: "On-site",
      description: "We are looking for a Data Analyst Intern to join our team.",
      requirements: [
        "Strong knowledge of SQL",
        "Experience with Python",
        "Good analytical skills",
      ],
      paid: false,
      duration: "6 months",
      status: "open",
      applications: [],
    },
  ]);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <LoginPage
                setCurrUser={setCurrUser}
                studentUser={studentUsers}
                scadUser={scadUsers}
                companyUser={companyUsers}
              />
            }
          />
          <Route
            path="/CompanyRegister"
            element={<CompanyRegister setCompanyUsers={setCompanyUsers} />}
          />
          <Route
            path="/studentsDashboard"
            element={
              <StudentsDashboard
                companyUsers={companyUsers}
                allInternships={allInternships}
                setAllInternships={setAllInternships}
              />
            }
          />
          <Route
            path="/internshipDetails/:id/:companyName"
            element={<InternshipDetails companyUsers={companyUsers} />}
          />

          <Route
            path="/InternshipApplicationPage/:internshipId/:companyName"
            element={
              <InternshipApplicationPage
                companyUsers={companyUsers}
                setCompanyUsers={setCompanyUsers}
                currUser={currUser}
              />
            }
          />

          <Route
            path="/StudentProfile"
            element={
              <StudentProfile currUser={currUser} studentUsers={studentUsers} />
            }
          />
          <Route
            path="/ViewCompanyRequest"
            element={
              <ViewCompanyRequest
                companyRequests={companyRequests}
                setCompanyRequests={setCompanyRequests}
              />
            }
          />
          <Route
            path="/CompanyViewPostings"
            element={<CompanyViewPostings currUser={currUser} />}
          />
          <Route
            path="/ApplicantDetails/:username"
            element={
              <ApplicantDetails
                companyUsers={companyUsers}
                studentUsers={studentUsers}
                setStudentUsers={setStudentUsers}
                setCompanyUsers={setCompanyUsers}
              />
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
