import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

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
import StudentInternships from "./pages/StudentInternships/StudentInternships";
import StudentReportSubmission from "./pages/StudentReportSubmission/StudentReportSubmission";
import ViewCompanyRequestDetails from "./pages/ViewCompanyRequestDetails/ViewCompanyRequestDetails";
import StudentEvaluationSubmission from "./pages/StudentEvaluationSubmission/StudentEvaluationSubmission";
import SuggestedCompanies from "./pages/SuggestedCompanies/SuggestedCompanies";
import NotificationList from "./components/NotificationList/NotificationList";
import ViewCompanyPostings from "./pages/ViewCompanyPostings/ViewCompanyPostings";
import CompletedInterns from "./pages/CompletedInterns/CompletedInterns";
import InternEvaluation from "./pages/InternEvaluation/InternEvaluation";
import ActiveInterns from "./pages/ActiveInterns/ActiveInterns";
import ScadDashboard from "./pages/ScadDashboard/ScadDashboard";
import AllStudents from "./pages/AllStudents/AllStudents";
import ScadViewOfStudentProfile from "./pages/ScadViewOfStudentProfile/ScadViewOfStudentProfile";
import ViewInternshipItem from "./pages/ViewInternshipItem/ViewInternshipItem";

function App() {
  // this stores the current user logged in
  // it can be a student, scad user or company user
  const [currUser, setCurrUser] = useState(undefined);
  const [scadUsers, setScadUsers] = useState([
    { username: "scad", password: "1234" },
  ]);

  // Add notifications state
  const [notifications, setNotifications] = useState([]);

  // Function to add a notification
  const addNotification = (message, type) => {
    const newNotification = {
      message,
      type,
      id: Date.now(),
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(newNotification.id);
    }, 5000);
  };

  // Function to dismiss a notification
  const dismissNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

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

  // Check for status changes in companyRequests to create notifications
  useEffect(() => {
    if (currUser && currUser.username) {
      // Find matching company request
      const userRequest = companyRequests.find(
        (request) => request.companyName === currUser.name
      );

      // If the company's request status has changed to accepted or rejected
      if (userRequest && !userRequest.notified) {
        if (userRequest.status === "accepted") {
          addNotification(
            "Your company application has been accepted!",
            "success"
          );

          // Mark as notified
          setCompanyRequests((prev) =>
            prev.map((req) =>
              req.companyName === userRequest.companyName
                ? { ...req, notified: true }
                : req
            )
          );
        } else if (userRequest.status === "rejected") {
          addNotification(
            "Your company application has been rejected.",
            "error"
          );

          // Mark as notified
          setCompanyRequests((prev) =>
            prev.map((req) =>
              req.companyName === userRequest.companyName
                ? { ...req, notified: true }
                : req
            )
          );
        }
      }
    }
  }, [currUser, companyRequests]);

  return (
    <div>
      <NotificationList
        notifications={notifications}
        onDismiss={dismissNotification}
      />
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
                companyRequests={companyRequests}
                addNotification={addNotification}
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
                addNotification={addNotification}
              />
            }
          />

          <Route
            path="/StudentProfile"
            element={
              <StudentProfile
                currUser={currUser}
                studentUsers={studentUsers}
                setStudentUsers={setStudentUsers}
                setCurrUser={setCurrUser}
              />
            }
          />
          <Route
            path="/StudentInternships/:studentId"
            element={
              <StudentInternships
                companyUsers={companyUsers}
                studentUsers={studentUsers}
              />
            }
          />
          <Route
            path="/StudentReportSubmission/:studentId/:internshipId/:companyUsername"
            element={
              <StudentReportSubmission
                studentUsers={studentUsers}
                setStudentUsers={setStudentUsers}
              />
            }
          />
          <Route
            path="/StudentEvaluationSubmission/:studentId/:internshipId/:companyUsername"
            element={
              <StudentEvaluationSubmission
                studentUsers={studentUsers}
                setStudentUsers={setStudentUsers}
              />
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
            path="/ViewCompanyRequestDetails/:companyName"
            element={
              <ViewCompanyRequestDetails
                companyRequests={companyRequests}
                setCompanyRequests={setCompanyRequests}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/CompanyViewPostings"
            element={
              <CompanyViewPostings
                currUser={currUser}
                companyUsers={companyUsers}
                setCompanyUsers={setCompanyUsers}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/ViewCompanyPostings"
            element={<ViewCompanyPostings companyUsers={companyUsers} />}
          />
          <Route
            path="/ApplicantDetails/:username"
            element={
              <ApplicantDetails
                companyUsers={companyUsers}
                setCompanyUsers={setCompanyUsers}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/MyInterns"
            element={
              <MyInterns companyUsers={companyUsers} currUser={currUser} />
            }
          />
          <Route
            path="/SuggestedCompanies"
            element={
              <SuggestedCompanies
                currUser={currUser}
                companyUsers={companyUsers}
                studentUsers={studentUsers}
              />
            }
          />
          <Route
            path="/completed-interns"
            element={
              <CompletedInterns
                currUser={currUser}
                companyUsers={companyUsers}
                setCompanyUsers={setCompanyUsers}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/active-interns"
            element={
              <ActiveInterns
                currUser={currUser}
                companyUsers={companyUsers}
                setCompanyUsers={setCompanyUsers}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/intern-evaluation/:username"
            element={
              <InternEvaluation
                companyUsers={companyUsers}
                setCompanyUsers={setCompanyUsers}
                addNotification={addNotification}
              />
            }
          />
          <Route path="/ScadDashboard" element={<ScadDashboard />} />
          <Route
            path="/AllStudents"
            element={<AllStudents studentUsers={studentUsers} />}
          />
          <Route
            path="/ScadViewOfStudentProfile/:studentID"
            element={
              <ScadViewOfStudentProfile
                studentUsers={studentUsers}
                companyUsers={companyUsers}
              />
            }
          />
          <Route
            path="/scad/viewInternshipItem/:type/:studentId/:internshipId/:companyUsername"
            element={<ViewInternshipItem studentUsers={studentUsers} />}
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
