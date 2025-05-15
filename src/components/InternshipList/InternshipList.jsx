import React from "react";
import { Link } from "react-router-dom";
import "./InternshipList.css"; // Make sure this line is added

function InternshipList({ internship }) {
  return (
    <Link
      to={`/internshipDetails/${internship.internshipID}/${internship.companyName}`}
      className="internship-card-link"
    >
      <div className="internship-card">
        <div className="internship-main-info">
          <h2 className="internship-title">{internship.title}</h2>
          <div className="internship-badges">
            <span className={`badge ${internship.paid ? "paid" : "unpaid"}`}>
              {internship.paid ? "Paid" : "Unpaid"}
            </span>
            {internship.status && (
              <span
                className={`badge status-${internship.status.toLowerCase()}`}
              >
                {internship.status}
              </span>
            )}
          </div>
        </div>
        <div className="internship-details">
          <p className="internship-company">
            <span className="detail-label">Company:</span>{" "}
            {internship.companyName}
          </p>
          {internship.industry && (
            <p className="internship-industry">
              <span className="detail-label">Industry:</span>{" "}
              {internship.industry}
            </p>
          )}
          <p className="internship-location">
            <span className="detail-label">Location:</span>{" "}
            {internship.location}
          </p>
          {internship.duration && (
            <p className="internship-duration">
              <span className="detail-label">Duration:</span>{" "}
              {internship.duration}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default InternshipList;
