import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import "./StudentPastInternships.css";

function StudentPastInternships({ studentUsers, setStudentUsers, currUser }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, reports, reviews
  const [searchTerm, setSearchTerm] = useState("");

  if (!currUser) {
    return (
      <div className="dashboard-container">
        <StudentsNavBar />
        <div className="error-message">
          <p>Please log in to view your past internships.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  const student = studentUsers.find((s) => s.studentId === currUser.studentId);

  if (!student) {
    return (
      <div className="dashboard-container">
        <StudentsNavBar />
        <div className="error-message">
          <p>Student information not found.</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  // Filter internships based on status and search term
  const filteredInternships = student.appliedInternships.filter(
    (internship) => {
      if (!internship) return false;

      const matchesSearch =
        (internship.internshipTitle?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (internship.companyName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        );

      if (filter === "all") return matchesSearch;
      if (filter === "reports" && internship.report) return matchesSearch;
      if (filter === "reviews" && internship.review) return matchesSearch;
      return false;
    }
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "status-badge accepted";
      case "rejected":
        return "status-badge rejected";
      case "flagged":
        return "status-badge flagged";
      default:
        return "status-badge pending";
    }
  };

  return (
    <div className="dashboard-container">
      <StudentsNavBar currUser={currUser} />
      <main className="dashboard-main">
        <div className="past-internships-container">
          <div className="breadcrumb">
            <Link to="/studentsDashboard">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span>Past Internships</span>
          </div>

          <div className="past-internships-header">
            <h1>Past Internships</h1>
            <div className="past-internships-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by company or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="search-icon">🔍</i>
              </div>
              <div className="filter-buttons">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filter === "reports" ? "active" : ""}
                  onClick={() => setFilter("reports")}
                >
                  Reports
                </button>
                <button
                  className={filter === "reviews" ? "active" : ""}
                  onClick={() => setFilter("reviews")}
                >
                  Reviews
                </button>
              </div>
            </div>
          </div>

          <div className="internships-list">
            {filteredInternships.length === 0 ? (
              <div className="no-internships">
                <p>No past internships found.</p>
              </div>
            ) : (
              filteredInternships.map((internship) => (
                <div key={internship.internshipId} className="internship-card">
                  <div className="internship-header">
                    <h2>{internship.internshipTitle}</h2>
                    <span className="company-name">
                      {internship.companyName}
                    </span>
                  </div>

                  <div className="internship-details">
                    <div className="detail-item">
                      <span className="label">Duration:</span>
                      <span className="value">{internship.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Period:</span>
                      <span className="value">
                        {new Date(internship.startDate).toLocaleDateString()} -{" "}
                        {new Date(internship.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {internship.report && (
                    <div className="report-section">
                      <h3>Report</h3>
                      <div className="status-info">
                        <span
                          className={getStatusBadgeClass(
                            internship.report.status
                          )}
                        >
                          {internship.report.status}
                        </span>
                        <span className="submission-date">
                          Submitted:{" "}
                          {new Date(
                            internship.report.date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {internship.report.adminComment && (
                        <div className="admin-comment">
                          <h4>Administrator's Comment</h4>
                          <p>{internship.report.adminComment}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {internship.review && (
                    <div className="review-section">
                      <h3>Company Review</h3>
                      <div className="status-info">
                        <span
                          className={getStatusBadgeClass(
                            internship.review.status
                          )}
                        >
                          {internship.review.status}
                        </span>
                        <span className="submission-date">
                          Submitted:{" "}
                          {new Date(
                            internship.review.date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-ratings">
                        <div className="rating-item">
                          <span className="rating-label">
                            Technical Skills:
                          </span>
                          <span className="rating-value">
                            {internship.review.technicalSkillsRating}/5
                          </span>
                        </div>
                        <div className="rating-item">
                          <span className="rating-label">Communication:</span>
                          <span className="rating-value">
                            {internship.review.communicationSkillsRating}/5
                          </span>
                        </div>
                        <div className="rating-item">
                          <span className="rating-label">Teamwork:</span>
                          <span className="rating-value">
                            {internship.review.teamworkRating}/5
                          </span>
                        </div>
                        <div className="rating-item">
                          <span className="rating-label">Overall:</span>
                          <span className="rating-value">
                            {internship.review.overallRating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentPastInternships;
