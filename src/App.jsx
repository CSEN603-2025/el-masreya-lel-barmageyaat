import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import StudentsDashboard from "./pages/studentsDashboard/StudentsDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import { useState } from "react";
import CompanyRegister from "./pages/CompanyRegister/CompanyRegister";
import ViewCompanyRequest from "./pages/ViewCompanyRequest/ViewCompanyRequest";
import InternshipDetails from "./pages/InternshipDetails/InternshipDetails";

function App() {
  const [userType, setUserType] = useState("");
  const [scadUsers, setScadUsers] = useState([
    { username: "scad", password: "1234" },
  ]);

  const [companyUsers, setCompanyUsers] = useState([
    {
      username: "company",
      password: "1234",
      industry: "IT",
      Size: "small",
      logo: null,
      email: "welloDev@amazing.com",
    },
  ]);

  const [studentUsers, setStudentUsers] = useState([
    { username: "wello", password: "1234" },
  ]);

  const [companyRequests, setCompanyRequests] = useState([
    {
      companyName: "welloDev",
      industry: "IT",
      companySize: "small",
      logo: null,
      email: "company@wello.com",
      status: "pending",
    },
    {
      companyName: "instabug",
      industry: "software",
      companySize: "corprate",
      logo: null,
      email: "instabug@wello.com",
      status: "pending",
    },
  ]);

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
      duration: "3 months",
      status: "open",
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
      duration: "6 months",
      status: "open",
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
                setUserType={setUserType}
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
                allInternships={allInternships}
                setAllInternships={setAllInternships}
              />
            }
          />
          <Route
            path="/internship/:id"
            element={<InternshipDetails allInternships={allInternships} />}
          />
          <Route path="/studentProfile" element={<StudentProfile />} />
          <Route
            path="/ViewCompanyRequest"
            element={
              <ViewCompanyRequest
                companyRequests={companyRequests}
                setCompanyRequests={setCompanyRequests}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
