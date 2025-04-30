import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import StudentsDashboard from "./pages/studentsDashboard/StudentsDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import { useState } from "react";
import CompanyRegister from "./pages/CompanyRegister/CompanyRegister";
import ViewCompanyRequest from "./pages/ViewCompanyRequest/ViewCompanyRequest";
import InternshipDetails from "./pages/InternshipDetails/InternshipDetails";
import InternshipApplicationPage from "./pages/InternshipApplicationPage/InternshipApplicationPage";

function App() {
  // this stores the current user logged in
  // it can be a student, scad user or company user
  const [currUser, setCurrUser] = useState(undefined);
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
    {
      username: "wello",
      password: "1234",
      interests: [
        "software engineering",
        "backend developer",
        "front end developer",
      ],
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "HTML",
        "CSS",
        "Python",
        "Django",
      ],
      experiences: [
        {
          title: "Frontend Intern",
          company: "Instabug",
          responsibilities: "Built UI components using React and improved UX.",
          duration: "3 months",
        },
        {
          title: "Part-time Web Developer",
          company: "Freelance",
          responsibilities: "Developed personal websites for clients.",
          duration: "6 months",
        },
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          institution: "SCAD University",
          graduationYear: 2024,
        },
      ],
      graduationYear: 2027,
      resume: null,
      profilePicture: null,
    },
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
                allInternships={allInternships}
                setAllInternships={setAllInternships}
              />
            }
          />
          <Route
            path="/internship/:id"
            element={<InternshipDetails allInternships={allInternships} />}
          />
          <Route
            path="/InternshipApplicationPage/:internshipId"
            element={
              <InternshipApplicationPage
                allInternships={allInternships}
                setAllInternships={setAllInternships}
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
