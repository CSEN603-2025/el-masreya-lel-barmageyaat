import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import StudentsDashboard from "./pages/studentsDashboard/StudentsDashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import { useState } from "react";
import CompanyRegister from "./pages/CompanyRegister/CompanyRegister";

function App() {
  const [userType, setUserType] = useState("");

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage setUserType={setUserType} />}
          />
          <Route path="/studentProfile" element={<StudentProfile />} />
          <Route path="/CompanyRegister" element={<CompanyRegister />} />
          <Route path="/studentsDashboard" element={<StudentsDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
