import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import Applicant from "../../components/Applicant/Applicant";
import "./InternshipDetails.css";

function InternshipDetails({ companyUsers, currUser }) {
  const navigate = useNavigate();
  const { id, companyName } = useParams();

  const company = companyUsers.find((c) => c.username === companyName);
  if (!company) return <p className="not-found-msg">Company not found.</p>;

  const internship = company.internships.find(
    (i) => i.internshipID === parseInt(id)
  );
  if (!internship)
    return <p className="not-found-msg">Internship not found.</p>;

  function handleApply() {
    navigate(
      `/internshipApplicationPage/${internship.internshipID}/${companyName}`
    );
  }

  return (
    <div className="students-dashboard">
      <StudentsNavBar />
      <div className="dashboard-main internship-details-page">
        <div className="dashboard-section internship-header">
          <h1>{internship.title}</h1>
          <p className="company-name">{internship.companyName}</p>
        </div>

        <div className="dashboard-section internship-info">
          <p>
            <strong>Location:</strong> {internship.location}
          </p>
          <p>
            <strong>Description:</strong> {internship.description}
          </p>
          <div>
            <strong>Requirements:</strong>
            <ul>
              {internship.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <p>
            <strong>Compensation:</strong> {internship.paid ? "Paid" : "Unpaid"}
          </p>
          {internship.paid && (
            <p>
              <strong>Salary:</strong> {internship.salary}
            </p>
          )}
          <p>
            <strong>Duration:</strong> {internship.duration}
          </p>
          <p>
            <strong>Status:</strong> {internship.status}
          </p>
        </div>

        <div className="internship-buttons">
          <button
            className="action-button view-suggested"
            onClick={handleApply}
          >
            Apply Now
          </button>
          <button
            className="action-button view-profile"
            onClick={() => window.history.back()}
          >
            Back
          </button>
        </div>

        {!currUser.studentId && (
          <section className="dashboard-section applications-section">
            <h2>Applications</h2>
            {internship.applications.length > 0 ? (
              internship.applications.map((applicant, index) => (
                <div key={index} className="applicant-card">
                  <h3>Applicant {index + 1}</h3>
                  <Applicant applicant={applicant} />
                </div>
              ))
            ) : (
              <p>No applications yet.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default InternshipDetails;
