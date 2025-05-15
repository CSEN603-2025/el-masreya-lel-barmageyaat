import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ApplicantDetails.css";
import { generateApplicationPDF } from "../../utils/pdfGenerator";

function ApplicantDetails({ companyUsers, setCompanyUsers, addNotification }) {
  const { username } = useParams();
  const navigate = useNavigate();

  // Fetch the company applicant data
  const companyApplicant = companyUsers.flatMap((company) =>
    company.internships.flatMap((internship) =>
      internship.applications.filter(
        (application) => application.username === username
      )
    )
  )[0];

  const handleStatusChange = (newStatus) => {
    const prevStatus = companyApplicant.status;

    const updatedCompanyUsers = companyUsers.map((company) => ({
      ...company,
      internships: company.internships.map((internship) => ({
        ...internship,
        applications: internship.applications.map((application) =>
          application.username === username
            ? {
                ...application,
                status: newStatus,
                statusNotified: false,
              }
            : application
        ),
      })),
    }));

    setCompanyUsers(updatedCompanyUsers);

    // Send a notification when status changes
    if (addNotification && prevStatus !== newStatus) {
      if (newStatus === "accepted") {
        addNotification(
          `Application for ${companyApplicant.firstName} ${companyApplicant.lastName} has been accepted.`,
          "success"
        );
      } else if (newStatus === "rejected") {
        addNotification(
          `Application for ${companyApplicant.firstName} ${companyApplicant.lastName} has been rejected.`,
          "error"
        );
      } else if (newStatus === "finalized") {
        addNotification(
          `Application for ${companyApplicant.firstName} ${companyApplicant.lastName} has been finalized.`,
          "info"
        );
      }
    }
  };

  const handleInternshipStatusChange = (newStatus) => {
    const prevStatus = companyApplicant.internshipStatus;

    const updatedCompanyUsers = companyUsers.map((company) => ({
      ...company,
      internships: company.internships.map((internship) => ({
        ...internship,
        applications: internship.applications.map((application) =>
          application.username === username
            ? {
                ...application,
                internshipStatus: newStatus,
                internshipStatusNotified: false,
                completionDate:
                  newStatus === "InternshipComplete"
                    ? new Date().toISOString()
                    : application.completionDate,
              }
            : application
        ),
      })),
    }));

    setCompanyUsers(updatedCompanyUsers);

    // Send a notification when internship status changes
    if (addNotification && prevStatus !== newStatus) {
      if (newStatus === "currentIntern") {
        addNotification(
          `${companyApplicant.firstName} ${companyApplicant.lastName} has started the internship.`,
          "info"
        );
      } else if (newStatus === "InternshipComplete") {
        addNotification(
          `${companyApplicant.firstName} ${companyApplicant.lastName} has completed the internship.`,
          "success"
        );
      }
    }
  };

  const handleDownloadPDF = () => {
    if (!companyApplicant) return;
    
    // Find the company and internship this application belongs to
    let companyName = "";
    let internshipTitle = "";
    
    companyUsers.forEach(company => {
      company.internships.forEach(internship => {
        internship.applications.forEach(application => {
          if (application.username === username) {
            companyName = company.name || company.username;
            internshipTitle = internship.title;
          }
        });
      });
    });
    
    const applicationData = {
      studentName: `${companyApplicant.firstName} ${companyApplicant.lastName}`,
      studentId: companyApplicant.studentId || "",
      email: companyApplicant.email,
      companyName: companyName,
      internshipTitle: internshipTitle,
      status: companyApplicant.status || "pending",
      internshipStatus: companyApplicant.internshipStatus || "didntStartYet",
      appliedAt: companyApplicant.appliedAt || new Date().toISOString(),
      coverLetter: companyApplicant.coverLetter || "",
      skills: companyApplicant.skills || [],
      experiences: companyApplicant.experiences || []
    };
    
    const success = generateApplicationPDF(
      applicationData,
      `application_${companyApplicant.firstName}_${companyApplicant.lastName}`
    );
    
    if (success && addNotification) {
      addNotification("Application details exported as PDF successfully!", "success");
    }
  };

  if (!companyApplicant) {
    return (
      <div className="applicant-not-found">
        <h1>No applicant found</h1>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="applicant-details-container">
      <div className="applicant-header">
        <h1>Applicant Details</h1>
        <div className="status-badges">
          <span className={`status-badge ${companyApplicant.status}`}>
            {companyApplicant.status}
          </span>
          <span className={`status-badge ${companyApplicant.internshipStatus}`}>
            {companyApplicant.internshipStatus}
          </span>
        </div>
      </div>

      <div className="applicant-info">
        <div className="info-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <p>
                {companyApplicant.firstName} {companyApplicant.lastName}
              </p>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <p>{companyApplicant.email}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Skills</h2>
          <div className="skills-list">
            {companyApplicant.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2>Cover Letter</h2>
          <div className="cover-letter">{companyApplicant.coverLetter}</div>
        </div>

        <div className="info-section">
          <h2>Application Status</h2>
          <div className="status-controls">
            <div className="status-group">
              <label>Application Status:</label>
              <select
                value={companyApplicant.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`status-select ${companyApplicant.status}`}
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="finalized">Finalized</option>
              </select>
            </div>

            <div className="status-group">
              <label>Internship Progress:</label>
              <select
                value={companyApplicant.internshipStatus}
                onChange={(e) => handleInternshipStatusChange(e.target.value)}
                className={`status-select ${companyApplicant.internshipStatus}`}
              >
                <option value="didntStartYet">Not Started</option>
                <option value="currentIntern">In Progress</option>
                <option value="InternshipComplete">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {companyApplicant.internshipStatus === "InternshipComplete" && (
          <div className="info-section completion-info">
            <h2>Completion Details</h2>
            <p>
              <strong>Completed on:</strong>{" "}
              {new Date(companyApplicant.completionDate).toLocaleDateString()}
            </p>
            <div className="completion-actions">
              <button
                className="action-button"
                onClick={() => navigate(`/intern-evaluation/${username}`)}
              >
                View Evaluation
              </button>
              <button
                className="action-button"
                onClick={() => navigate(`/intern-report/${username}`)}
              >
                View Final Report
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={handleDownloadPDF} className="download-button">
          Download as PDF
        </button>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ApplicantDetails;
