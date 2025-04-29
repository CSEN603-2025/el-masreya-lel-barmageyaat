import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import StudentsDashboard from "./pages/studentsDashboard/StudentsDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import { useState } from "react";
import CompanyRegister from "./pages/CompanyRegister/CompanyRegister";
import ViewCompanyRequest from "./pages/ViewCompanyRequest/ViewCompanyRequest";

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
          <Route path="/studentsDashboard" element={<StudentsDashboard />} />
          <Route path="/studentProfile" element={<StudentProfile />} />
          <Route
            path="/ViewCompanyRequest"
            element={<ViewCompanyRequest companyRequests={companyRequests} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
