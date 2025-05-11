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
import StudentsViewApplications from "./pages/StudentsViewApplications/StudentsViewApplications";
import MyInterns from "./pages/MyInterns/MyInterns";

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
            element={<StudentsDashboard companyUsers={companyUsers} />}
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
                currUserId={currUser?.studentId}
                studentUsers={studentUsers}
                setStudentUsers={setStudentUsers}
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
            path="/StudentsViewApplications"
            element={
              <StudentsViewApplications
                companyUsers={companyUsers}
                studentUsers={studentUsers}
                currUserId={currUser?.studentId}
              />
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
                setCompanyUsers={setCompanyUsers}
              />
            }
          />
          <Route
            path="/MyInterns"
            element={
              <MyInterns companyUsers={companyUsers} currUser={currUser} />
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
