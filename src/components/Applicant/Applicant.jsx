import React from "react";
import { useNavigate } from "react-router-dom";
import "./Applicant.css";

function Applicant({ applicant }) {
  const navigate = useNavigate();

  return (
    <div className="applicant-container">
      <div className="applicant-info">
        <p>
          <strong>Name:</strong> {applicant.firstName} {applicant.lastName}
        </p>
        <p>
          <strong>Email:</strong> {applicant.email}
        </p>
        <p>
          <strong>Cover Letter:</strong>
        </p>
        <p className="cover-letter">{applicant.coverLetter}</p>
      </div>

      <div className="applicant-buttons">
        <button
          onClick={() => navigate(`/ApplicantDetails/${applicant.username}`)}
        >
          View Details
        </button>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
      </div>
    </div>
  );
}

export default Applicant;
