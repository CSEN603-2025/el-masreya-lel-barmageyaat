import { useState } from "react";
import React from "react";

import { useNavigate } from "react-router-dom";
import "./ActiveInterns.css";

function ActiveInterns({
  companyUsers,
  currUser,
  setCompanyUsers,
  addNotification,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  if (!currUser) {
    navigate("/login");
    return null;
  }

  // Get current company's data
  const companyData = companyUsers.find(
    (company) => company.username === currUser.username
  );

  // Get all active interns from all internships
  const activeInterns =
    companyData?.internships?.flatMap((internship) =>
      (internship.applications || [])
        .filter(
          (application) => application.internshipStatus === "currentIntern"
        )
        .map((application) => ({
          ...application,
          internshipTitle: internship.title,
          internshipId: internship.internshipID,
          internshipDuration: internship.duration,
        }))
    ) || [];

  // Filter interns based on search
  const filteredInterns = activeInterns.filter((intern) => {
    const searchString = searchTerm.toLowerCase();
    const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
    const internshipTitle = intern.internshipTitle.toLowerCase();

    return (
      fullName.includes(searchString) || internshipTitle.includes(searchString)
    );
  });

  const handleMarkAsCompleted = (intern) => {
    console.log("Before marking as completed:", companyUsers);
    console.log("Intern to mark as completed:", intern);

    if (
      window.confirm(
        `Are you sure you want to mark ${intern.firstName} ${intern.lastName}'s internship as completed?`
      )
    ) {
      const updatedCompanyUsers = companyUsers.map((company) => ({
        ...company,
        internships: (company.internships || []).map((internship) => {
          // Check if this is the internship the intern belongs to
          if (internship.internshipID === intern.internshipId) {
            console.log("Found matching internship:", internship.title);
            return {
              ...internship,
              applications: (internship.applications || []).map(
                (application) => {
                  // Check if this is the application for the current intern
                  if (application.username === intern.username) {
                    console.log(
                      "Found matching application:",
                      application.username
                    );
                    return {
                      ...application,
                      internshipStatus: "InternshipComplete",
                      completionDate: new Date().toISOString(),
                    };
                  }
                  return application;
                }
              ),
            };
          }
          return internship;
        }),
      }));

      console.log("After marking as completed:", updatedCompanyUsers);

      setCompanyUsers(updatedCompanyUsers);
      addNotification(
        `${intern.firstName} ${intern.lastName} has completed their internship!`,
        "success"
      );

      // Navigate to completed interns page to see the marked intern
      setTimeout(() => {
        navigate("/completed-interns");
      }, 1000);
    }
  };

  return (
    <div className="active-interns-container">
      <div className="active-interns-header">
        <h1>Current Active Interns</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or internship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="active-interns-stats">
        <div className="stat-card">
          <h3>Total Active Interns</h3>
          <p className="stat-number">{activeInterns.length}</p>
        </div>
      </div>

      <div className="interns-list">
        {filteredInterns.length > 0 ? (
          filteredInterns.map((intern) => (
            <div
              key={`${intern.username}-${intern.internshipId}`}
              className="intern-card"
            >
              <div className="intern-info">
                <div className="intern-primary-info">
                  <h2>
                    {intern.firstName} {intern.lastName}
                  </h2>
                </div>
                <div className="intern-details">
                  <p>
                    <strong>Current Internship:</strong>{" "}
                    {intern.internshipTitle}
                  </p>
                  <p>
                    <strong>Email:</strong> {intern.email}
                  </p>
                  <p>
                    <strong>Duration:</strong> {intern.internshipDuration}
                  </p>
                </div>
                <div className="intern-skills">
                  {intern.skills &&
                    intern.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                </div>
                <div className="intern-actions">
                  <button
                    onClick={() => handleMarkAsCompleted(intern)}
                    className="complete-button"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/viewApplications/${intern.internshipId}/applicant/${intern.username}`
                      )
                    }
                    className="details-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-interns">
            <p>No active interns found.</p>
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button
          onClick={() => navigate("/completed-interns")}
          className="view-completed-button"
        >
          View Completed Interns
        </button>
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
}

export default ActiveInterns;
