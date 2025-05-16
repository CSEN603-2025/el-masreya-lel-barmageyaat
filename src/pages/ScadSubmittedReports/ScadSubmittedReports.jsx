import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ScadSubmittedReports.css";

const ScadSubmittedReports = ({ studentUsers, companyUsers }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Extract all unique majors from students
  const availableMajors = useMemo(() => {
    const majors = new Set();
    studentUsers.forEach((student) => {
      if (student.major) {
        majors.add(student.major);
      }
    });
    return Array.from(majors).sort();
  }, [studentUsers]);

  // Collect all submitted reports from students
  const allReports = useMemo(() => {
    const reports = [];

    studentUsers.forEach((student) => {
      if (student.appliedInternships) {
        student.appliedInternships.forEach((internship) => {
          // Check if this internship has a review or report
          if (internship.review || internship.report) {
            // Find the company
            const company = companyUsers.find(
              (c) => c.username === internship.companyUsername
            );

            // Find the internship details
            const internshipDetails = company?.internships?.find(
              (i) => i.id === internship.internshipId
            );

            // Determine report status
            let reportStatus = "pending";
            if (internship.report && internship.report.status) {
              reportStatus = internship.report.status;
            } else if (internship.reportStatus) {
              reportStatus = internship.reportStatus;
            }

            reports.push({
              id: `${student.studentId}-${internship.internshipId}-${internship.companyUsername}`,
              studentId: student.studentId,
              studentName: `${student.firstName} ${student.lastName}`,
              major: student.major || "Undeclared",
              semester: student.semester || "N/A",
              companyName: company?.name || internship.companyUsername,
              internshipId: internship.internshipId,
              companyUsername: internship.companyUsername,
              internshipTitle:
                internshipDetails?.title ||
                internship.internshipTitle ||
                "Internship",
              date:
                internship.review?.date ||
                internship.report?.date ||
                internship.appliedAt,
              hasReview: !!internship.review,
              hasReport: !!internship.report,
              status: internship.internshipStatus || "Unknown",
              reportStatus: reportStatus,
            });
          }
        });
      }
    });

    return reports;
  }, [studentUsers, companyUsers]);

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = [...allReports];

    // Apply document type filter
    if (filter !== "all") {
      filtered = filtered.filter((report) => {
        if (filter === "review") return report.hasReview;
        if (filter === "report") return report.hasReport;
        if (filter === "both") return report.hasReview && report.hasReport;
        if (filter === "completed")
          return report.status === "InternshipComplete";
        return true;
      });
    }

    // Apply major filter
    if (majorFilter !== "all") {
      filtered = filtered.filter((report) => report.major === majorFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (report) => report.reportStatus === statusFilter
      );
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.studentName.toLowerCase().includes(term) ||
          report.companyName.toLowerCase().includes(term) ||
          report.internshipTitle.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === "student") {
        comparison = a.studentName.localeCompare(b.studentName);
      } else if (sortBy === "company") {
        comparison = a.companyName.localeCompare(b.companyName);
      } else if (sortBy === "major") {
        comparison = a.major.localeCompare(b.major);
      } else if (sortBy === "status") {
        comparison = a.reportStatus.localeCompare(b.reportStatus);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    allReports,
    filter,
    majorFilter,
    statusFilter,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Get counts for the different statuses
  const statusCounts = useMemo(() => {
    return {
      pending: allReports.filter((r) => r.reportStatus === "pending").length,
      accepted: allReports.filter((r) => r.reportStatus === "accepted").length,
      rejected: allReports.filter((r) => r.reportStatus === "rejected").length,
      flagged: allReports.filter((r) => r.reportStatus === "flagged").length,
    };
  }, [allReports]);

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
        <div className="scad-reports-container">
          <h1>Submitted Internship Reports</h1>
          <p className="reports-description">
            View and manage all reports and evaluations submitted by students
            after completing their internships.
          </p>

          <div className="reports-controls">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by student, company, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Documents</option>
                <option value="review">Has Evaluation</option>
                <option value="report">Has Report</option>
                <option value="both">Has Both</option>
                <option value="completed">Completed Internships</option>
              </select>
            </div>

            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Submission Date</option>
                <option value="student">Student Name</option>
                <option value="company">Company Name</option>
                <option value="major">Major</option>
                <option value="status">Status</option>
              </select>

              <button
                className="sort-order-button"
                onClick={toggleSortOrder}
                aria-label={`Sort ${
                  sortOrder === "asc" ? "ascending" : "descending"
                }`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <div className="advanced-filters">
            <div className="filter-group">
              <label>Major:</label>
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Majors</option>
                {availableMajors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Report Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">
                  Pending ({statusCounts.pending})
                </option>
                <option value="accepted">
                  Accepted ({statusCounts.accepted})
                </option>
                <option value="rejected">
                  Rejected ({statusCounts.rejected})
                </option>
                <option value="flagged">
                  Flagged ({statusCounts.flagged})
                </option>
              </select>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="no-reports">
              <p>No reports found matching your criteria.</p>
            </div>
          ) : (
            <div className="reports-list">
              <div className="reports-header">
                <div className="header-student">Student</div>
                <div className="header-company">Company</div>
                <div className="header-internship">Internship</div>
                <div className="header-major">Major</div>
                <div className="header-status">Status</div>
                <div className="header-actions">Actions</div>
              </div>

              {filteredReports.map((report) => (
                <div key={report.id} className="report-item">
                  <div className="report-student">{report.studentName}</div>
                  <div className="report-company">{report.companyName}</div>
                  <div className="report-internship">
                    {report.internshipTitle}
                  </div>
                  <div className="report-major">{report.major}</div>
                  <div className="report-status">
                    <span className={`status-badge ${report.reportStatus}`}>
                      {report.reportStatus.charAt(0).toUpperCase() +
                        report.reportStatus.slice(1)}
                    </span>
                  </div>
                  <div className="report-actions">
                    {report.hasReport && (
                      <Link
                        to={`/scad/viewInternshipItem/report/${report.studentId}/${report.internshipId}/${report.companyUsername}`}
                        className="view-button report"
                      >
                        View Report
                      </Link>
                    )}
                    {report.hasReview && (
                      <Link
                        to={`/scad/viewInternshipItem/review/${report.studentId}/${report.internshipId}/${report.companyUsername}`}
                        className="view-button review"
                      >
                        View Student Review
                      </Link>
                    )}
                    {report.hasCompanyReview && (
                      <Link
                        to={`/scad/viewInternshipItem/company-review/${report.studentId}/${report.internshipId}/${report.companyUsername}`}
                        className="view-button company-review"
                      >
                        View Company Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="reports-summary">
            <p>
              Total submissions: <strong>{filteredReports.length}</strong> of{" "}
              {allReports.length}
            </p>
            <p>
              Reports:{" "}
              <strong>
                {filteredReports.filter((r) => r.hasReport).length}
              </strong>{" "}
              | Evaluations:{" "}
              <strong>
                {filteredReports.filter((r) => r.hasReview).length}
              </strong>{" "}
              | Complete submissions:{" "}
              <strong>
                {
                  filteredReports.filter((r) => r.hasReport && r.hasReview)
                    .length
                }
              </strong>
            </p>
            <p>
              Status breakdown: Pending:{" "}
              <strong>
                {
                  filteredReports.filter((r) => r.reportStatus === "pending")
                    .length
                }
              </strong>{" "}
              | Accepted:{" "}
              <strong>
                {
                  filteredReports.filter((r) => r.reportStatus === "accepted")
                    .length
                }
              </strong>{" "}
              | Rejected:{" "}
              <strong>
                {
                  filteredReports.filter((r) => r.reportStatus === "rejected")
                    .length
                }
              </strong>{" "}
              | Flagged:{" "}
              <strong>
                {
                  filteredReports.filter((r) => r.reportStatus === "flagged")
                    .length
                }
              </strong>
            </p>
          </div>

          <div className="navigation-footer">
            <button
              onClick={() => navigate("/ScadDashboard")}
              className="back-button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScadSubmittedReports;
