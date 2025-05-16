import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ScadCompanyEvaluations.css";

const ScadCompanyEvaluations = ({ companyUsers, studentUsers }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  // Collect all evaluations from companies
  const evaluations = useMemo(() => {
    const allEvaluations = [];
    companyUsers.forEach((company) => {
      if (company.interns) {
        company.interns.forEach((intern) => {
          if (intern.evaluation) {
            allEvaluations.push({
              ...intern.evaluation,
              companyName: company.companyName,
              companyUsername: company.username,
              studentId: intern.studentId,
              internshipId: intern.internshipId,
              position: intern.position,
              startDate: intern.startDate,
              endDate: intern.endDate,
            });
          }
        });
      }
    });
    return allEvaluations;
  }, [companyUsers]);

  // Filter and sort evaluations
  const filteredEvaluations = useMemo(() => {
    let filtered = [...evaluations];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (evaluation) =>
          evaluation.companyName.toLowerCase().includes(searchLower) ||
          evaluation.studentId.toLowerCase().includes(searchLower) ||
          evaluation.position.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (evaluation) => evaluation.status === statusFilter
      );
    }

    // Sort evaluations
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(b.submissionDate) - new Date(a.submissionDate);
          break;
        case "company":
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case "student":
          comparison = a.studentId.localeCompare(b.studentId);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    return filtered;
  }, [evaluations, searchTerm, sortBy, sortOrder, statusFilter]);

  const handleSortOrderToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Get counts for the different statuses
  const statusCounts = useMemo(() => {
    return {
      pending: evaluations.filter((e) => e.status === "pending").length,
      accepted: evaluations.filter((e) => e.status === "accepted").length,
      rejected: evaluations.filter((e) => e.status === "rejected").length,
      flagged: evaluations.filter((e) => e.status === "flagged").length,
    };
  }, [evaluations]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCAD Office</h2>
          <div className="sidebar-divider"></div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/login">
                <i className="nav-icon logout-icon">🚪</i>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© 2023 SCAD Office</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="scad-evaluations-container">
          <h1>Company Evaluations</h1>
          <p className="evaluations-description">
            View and manage evaluations submitted by companies for their
            interns.
          </p>

          <div className="evaluations-controls">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by company, student ID, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="sort-controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Sort by Date</option>
                <option value="company">Sort by Company</option>
                <option value="student">Sort by Student</option>
                <option value="status">Sort by Status</option>
              </select>

              <button
                onClick={handleSortOrderToggle}
                className="sort-order-button"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <div className="advanced-filters">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {filteredEvaluations.length === 0 ? (
            <div className="no-evaluations">
              <p>No evaluations found matching your criteria.</p>
            </div>
          ) : (
            <div className="evaluations-list">
              <div className="evaluations-header">
                <div>Company</div>
                <div>Student ID</div>
                <div>Position</div>
                <div>Submission Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {filteredEvaluations.map((evaluation, index) => (
                <div key={index} className="evaluation-item">
                  <div>{evaluation.companyName}</div>
                  <div>{evaluation.studentId}</div>
                  <div>{evaluation.position}</div>
                  <div>
                    {new Date(evaluation.submissionDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className={`status-badge ${evaluation.status}`}>
                      {evaluation.status}
                    </span>
                  </div>
                  <div>
                    <button
                      className="view-button company-review"
                      onClick={() =>
                        navigate(
                          `/scad/viewInternshipItem/company-review/${evaluation.studentId}/${evaluation.internshipId}/${evaluation.companyUsername}`
                        )
                      }
                    >
                      View Evaluation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="evaluations-summary">
            <h3>Summary</h3>
            <p>Total Evaluations: {evaluations.length}</p>
            <p>Pending: {statusCounts.pending}</p>
            <p>Accepted: {statusCounts.accepted}</p>
            <p>Rejected: {statusCounts.rejected}</p>
            <p>Flagged: {statusCounts.flagged}</p>
          </div>

          <div className="navigation-footer">
            <button
              className="back-button"
              onClick={() => navigate("/ScadDashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScadCompanyEvaluations;
