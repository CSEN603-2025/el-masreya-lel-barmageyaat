import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ViewInternshipItem.css";

function ViewInternshipItem({ studentUsers, setStudentUsers }) {
  const { type, studentId, internshipId, companyUsername } = useParams();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);

  const student = studentUsers.find(
    (s) => s.studentId === parseInt(studentId, 10)
  );

  if (!student) {
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
          <div className="item-container error">
            <p>🚫 Student not found.</p>
            <button className="back-button" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const internship = student.appliedInternships.find(
    (i) =>
      i.internshipId === parseInt(internshipId, 10) &&
      i.companyUsername === companyUsername
  );

  if (!internship) {
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
          <div className="item-container error">
            <p>🚫 Internship not found for this student.</p>
            <button className="back-button" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Function to update report status
  const updateReportStatus = (status) => {
    if (!setStudentUsers) {
      setStatusMessage(
        "Error: Cannot update status (No setter function provided)"
      );
      return;
    }

    // If status is flagged or rejected, require a comment
    if (
      (status === "flagged" || status === "rejected") &&
      !adminComment.trim()
    ) {
      setStatusMessage(
        "Error: Please provide a comment when flagging or rejecting a report"
      );
      return;
    }

    // Create a deep copy of student users to avoid direct state mutation
    const updatedStudentUsers = JSON.parse(JSON.stringify(studentUsers));

    // Find the student and internship to update
    const studentIndex = updatedStudentUsers.findIndex(
      (s) => s.studentId === parseInt(studentId, 10)
    );

    if (studentIndex === -1) {
      setStatusMessage("Error: Student not found");
      return;
    }

    const internshipIndex = updatedStudentUsers[
      studentIndex
    ].appliedInternships.findIndex(
      (i) =>
        i.internshipId === parseInt(internshipId, 10) &&
        i.companyUsername === companyUsername
    );

    if (internshipIndex === -1) {
      setStatusMessage("Error: Internship not found");
      return;
    }

    // Update the report status
    if (
      type === "report" &&
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex]
        .report
    ) {
      updatedStudentUsers[studentIndex].appliedInternships[
        internshipIndex
      ].report.status = status;
      updatedStudentUsers[studentIndex].appliedInternships[
        internshipIndex
      ].reportStatus = status;

      // Add the admin comment if provided
      if (adminComment.trim()) {
        updatedStudentUsers[studentIndex].appliedInternships[
          internshipIndex
        ].report.adminComment = adminComment;
      }

      // Add a status update time
      updatedStudentUsers[studentIndex].appliedInternships[
        internshipIndex
      ].report.statusUpdatedAt = new Date().toISOString();

      // Add a notification to the student
      if (!updatedStudentUsers[studentIndex].notifications) {
        updatedStudentUsers[studentIndex].notifications = [];
      }

      const statusEmoji = {
        accepted: "✅",
        rejected: "❌",
        flagged: "⚠️",
        pending: "⏳",
      };

      const statusColor = {
        accepted: "success",
        rejected: "error",
        flagged: "warning",
        pending: "info",
      };

      updatedStudentUsers[studentIndex].notifications.push({
        id: Date.now(),
        message: `${statusEmoji[status]} Your internship report for "${
          internship.internshipTitle
        }" at ${internship.companyName || companyUsername} has been ${status}`,
        read: false,
        date: new Date().toISOString(),
        type: statusColor[status],
        category: "report_status",
        internshipId: parseInt(internshipId, 10),
        companyUsername: companyUsername,
        studentId: updatedStudentUsers[studentIndex].studentId,
      });

      // Update the state
      setStudentUsers(updatedStudentUsers);
      setStatusMessage(`Report status successfully updated to "${status}"`);
      setAdminComment("");
      setShowCommentField(false);
    } else if (
      type === "review" &&
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex]
        .review
    ) {
      updatedStudentUsers[studentIndex].appliedInternships[
        internshipIndex
      ].review.status = status;
      updatedStudentUsers[studentIndex].appliedInternships[
        internshipIndex
      ].reviewStatus = status;

      // Add a status update time
      updatedStudentUsers[studentIndex].appliedInternships[
        internshipIndex
      ].review.statusUpdatedAt = new Date().toISOString();

      // Add a notification to the student
      if (!updatedStudentUsers[studentIndex].notifications) {
        updatedStudentUsers[studentIndex].notifications = [];
      }

      updatedStudentUsers[studentIndex].notifications.push({
        id: Date.now(),
        message: `Your internship evaluation has been ${status}`,
        read: false,
        date: new Date().toISOString(),
      });

      // Update the state
      setStudentUsers(updatedStudentUsers);
      setStatusMessage(`Evaluation status successfully updated to "${status}"`);

      // Save to localStorage (backup approach)
      try {
        localStorage.setItem(
          "studentUsers",
          JSON.stringify(updatedStudentUsers)
        );
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    } else {
      setStatusMessage(`Error: No ${type} found to update`);
    }
  };

  const getCurrentStatus = () => {
    if (type === "report" && internship.report) {
      return internship.report.status || internship.reportStatus || "pending";
    } else if (type === "review" && internship.review) {
      return internship.review.status || internship.reviewStatus || "pending";
    }
    return "pending";
  };

  if (type === "report") {
    const report = internship.report;
    if (!report) {
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
            <div className="item-container error">
              <p>🚫 No report found for this internship.</p>
              <button className="back-button" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>
          </main>
        </div>
      );
    }

    const currentStatus = getCurrentStatus();

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
          <div className="item-container report">
            <div className="item-header">
              <h1>📄 Internship Report</h1>
              <div className="student-info">
                <p>
                  <strong>Student:</strong> {student.firstName}{" "}
                  {student.lastName}
                </p>
                <p>
                  <strong>Major:</strong> {student.major || "Undeclared"}
                </p>
                <p>
                  <strong>Submitted On:</strong>{" "}
                  {new Date(report.date).toLocaleDateString()}
                </p>
                <div className="report-status-indicator">
                  <strong>Status:</strong>
                  <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() +
                      currentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="report-content">
              {report.introduction && (
                <div className="report-section">
                  <h2>Introduction</h2>
                  <div className="report-text">{report.introduction}</div>
                </div>
              )}

              {report.body && (
                <div className="report-section">
                  <h2>Body</h2>
                  <div className="report-text">{report.body}</div>
                </div>
              )}

              {report.conclusion && (
                <div className="report-section">
                  <h2>Conclusion</h2>
                  <div className="report-text">{report.conclusion}</div>
                </div>
              )}

              {report.content && (
                <div className="report-section">
                  <h2>Report Content</h2>
                  <div className="report-text">{report.content}</div>
                </div>
              )}
            </div>

            <div className="status-actions">
              <h3>Update Report Status</h3>
              <div className="status-buttons">
                <button
                  className={`status-button accepted ${
                    currentStatus === "accepted" ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowCommentField(false);
                    updateReportStatus("accepted");
                  }}
                >
                  Accept
                </button>
                <button
                  className={`status-button rejected ${
                    currentStatus === "rejected" ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowCommentField(true);
                    setAdminComment("");
                  }}
                >
                  Reject
                </button>
                <button
                  className={`status-button flagged ${
                    currentStatus === "flagged" ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowCommentField(true);
                    setAdminComment("");
                  }}
                >
                  Flag for Review
                </button>
                <button
                  className={`status-button pending ${
                    currentStatus === "pending" ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowCommentField(false);
                    updateReportStatus("pending");
                  }}
                >
                  Mark as Pending
                </button>
              </div>

              {showCommentField && (
                <div className="comment-field">
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    placeholder="Please provide a reason for flagging or rejecting this report..."
                    className="admin-comment-input"
                  />
                  <div className="comment-actions">
                    <button
                      className="submit-comment-button"
                      onClick={() => {
                        if (currentStatus === "rejected") {
                          updateReportStatus("rejected");
                        } else {
                          updateReportStatus("flagged");
                        }
                      }}
                    >
                      Submit with Comment
                    </button>
                    <button
                      className="cancel-comment-button"
                      onClick={() => {
                        setShowCommentField(false);
                        setAdminComment("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {statusMessage && (
                <div
                  className={`status-message ${
                    statusMessage.includes("Error") ? "error" : "success"
                  }`}
                >
                  {statusMessage}
                </div>
              )}
            </div>

            {/* Display admin comment if it exists */}
            {report.adminComment && (
              <div className="admin-comment-section">
                <h3>Administrator's Comment</h3>
                <div className="admin-comment-content">
                  {report.adminComment}
                </div>
              </div>
            )}

            <div className="item-footer">
              <button className="back-button" onClick={() => navigate(-1)}>
                Back to Reports
              </button>
              <button
                className="dashboard-button"
                onClick={() => navigate("/ScadDashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  } else if (type === "review") {
    const review = internship.review;
    if (!review) {
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
            <div className="item-container error">
              <p>🚫 No student review found for this internship.</p>
              <button className="back-button" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>
          </main>
        </div>
      );
    }

    const currentStatus = getCurrentStatus();

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
          <div className="item-container review">
            <div className="item-header">
              <h1>⭐ Student's Review of Company</h1>
              <div className="student-info">
                <h2>Student Information</h2>
                <p>
                  <strong>Name:</strong> {student.firstName} {student.lastName}
                </p>
                <p>
                  <strong>Student ID:</strong> {student.studentId}
                </p>
                <p>
                  <strong>Major:</strong> {student.major || "Undeclared"}
                </p>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
              </div>

              <div className="internship-info">
                <h2>Internship Details</h2>
                <p>
                  <strong>Company:</strong>{" "}
                  {internship.companyName || companyUsername}
                </p>
                <p>
                  <strong>Position:</strong> {internship.internshipTitle}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(internship.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(internship.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Duration:</strong> {internship.duration}
                </p>
              </div>

              <div className="review-status">
                <h2>Review Status</h2>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() +
                      currentStatus.slice(1)}
                  </span>
                </p>
                <p>
                  <strong>Submitted On:</strong>{" "}
                  {new Date(review.date).toLocaleDateString()}
                </p>
                {review.statusUpdatedAt && (
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(review.statusUpdatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="review-content">
              <div className="review-section">
                <h2>Internship Experience</h2>
                <div className="review-text">{review.content}</div>
              </div>

              {review.rating && (
                <div className="review-section">
                  <h2>Rating</h2>
                  <div className="rating-display">
                    <span className="rating-value">{review.rating}/5</span>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? "star filled" : "star"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {review.recommend && (
                <div className="review-section">
                  <h2>Would Recommend</h2>
                  <div className="review-text">
                    {review.recommend === "yes" ? "Yes" : "No"}
                  </div>
                </div>
              )}

              {review.major && (
                <div className="review-section">
                  <h2>Major</h2>
                  <div className="review-text">{review.major}</div>
                </div>
              )}

              {review.courses && review.courses.length > 0 && (
                <div className="review-section">
                  <h2>Relevant Courses</h2>
                  <ul className="courses-list">
                    {review.courses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="status-actions">
              <h3>Update Review Status</h3>
              <div className="status-buttons">
                <button
                  className={`status-button accepted ${
                    currentStatus === "accepted" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("accepted")}
                >
                  Accept
                </button>
                <button
                  className={`status-button rejected ${
                    currentStatus === "rejected" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("rejected")}
                >
                  Reject
                </button>
                <button
                  className={`status-button flagged ${
                    currentStatus === "flagged" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("flagged")}
                >
                  Flag for Review
                </button>
                <button
                  className={`status-button pending ${
                    currentStatus === "pending" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("pending")}
                >
                  Mark as Pending
                </button>
              </div>
              {statusMessage && (
                <div
                  className={`status-message ${
                    statusMessage.includes("Error") ? "error" : "success"
                  }`}
                >
                  {statusMessage}
                </div>
              )}
            </div>

            <div className="item-footer">
              <button className="back-button" onClick={() => navigate(-1)}>
                Back to Reports
              </button>
              <button
                className="dashboard-button"
                onClick={() => navigate("/ScadDashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  } else if (type === "company-review") {
    // Find the company's review of the student
    const companyReview = internship.companyReview;
    if (!companyReview) {
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
            <div className="item-container error">
              <p>🚫 No company review found for this internship.</p>
              <button className="back-button" onClick={() => navigate(-1)}>
                Go Back
              </button>
            </div>
          </main>
        </div>
      );
    }

    const currentStatus = getCurrentStatus();

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
          <div className="item-container review">
            <div className="item-header">
              <h1>⭐ Company's Review of Student</h1>
              <div className="student-info">
                <h2>Student Information</h2>
                <p>
                  <strong>Name:</strong> {student.firstName} {student.lastName}
                </p>
                <p>
                  <strong>Student ID:</strong> {student.studentId}
                </p>
                <p>
                  <strong>Major:</strong> {student.major || "Undeclared"}
                </p>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
              </div>

              <div className="internship-info">
                <h2>Internship Details</h2>
                <p>
                  <strong>Company:</strong>{" "}
                  {internship.companyName || companyUsername}
                </p>
                <p>
                  <strong>Position:</strong> {internship.internshipTitle}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(internship.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(internship.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Duration:</strong> {internship.duration}
                </p>
                <p>
                  <strong>Supervisor:</strong>{" "}
                  {internship.supervisor || "Not specified"}
                </p>
                <p>
                  <strong>Supervisor Email:</strong>{" "}
                  {internship.supervisorEmail || "Not specified"}
                </p>
              </div>

              <div className="review-status">
                <h2>Review Status</h2>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() +
                      currentStatus.slice(1)}
                  </span>
                </p>
                <p>
                  <strong>Submitted On:</strong>{" "}
                  {new Date(companyReview.evaluationDate).toLocaleDateString()}
                </p>
                {companyReview.lastModified && (
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(companyReview.lastModified).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="review-content">
              <div className="review-section">
                <h2>Technical Skills</h2>
                <div className="rating-display">
                  <span className="rating-value">
                    {companyReview.technicalSkillsRating}/5
                  </span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < companyReview.technicalSkillsRating
                            ? "star filled"
                            : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="review-text">
                  {companyReview.technicalSkills}
                </div>
              </div>

              <div className="review-section">
                <h2>Communication Skills</h2>
                <div className="rating-display">
                  <span className="rating-value">
                    {companyReview.communicationSkillsRating}/5
                  </span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < companyReview.communicationSkillsRating
                            ? "star filled"
                            : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="review-text">
                  {companyReview.communicationSkills}
                </div>
              </div>

              <div className="review-section">
                <h2>Teamwork</h2>
                <div className="rating-display">
                  <span className="rating-value">
                    {companyReview.teamworkRating}/5
                  </span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < companyReview.teamworkRating
                            ? "star filled"
                            : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="review-text">{companyReview.teamwork}</div>
              </div>

              <div className="review-section">
                <h2>Initiative</h2>
                <div className="rating-display">
                  <span className="rating-value">
                    {companyReview.initiativeRating}/5
                  </span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < companyReview.initiativeRating
                            ? "star filled"
                            : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="review-text">{companyReview.initiative}</div>
              </div>

              <div className="review-section">
                <h2>Overall Performance</h2>
                <div className="rating-display">
                  <span className="rating-value">
                    {companyReview.overallRating}/5
                  </span>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < companyReview.overallRating
                            ? "star filled"
                            : "star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="review-text">
                  {companyReview.overallPerformance}
                </div>
              </div>

              <div className="review-section">
                <h2>Strengths & Achievements</h2>
                <div className="review-text">
                  {companyReview.strengthsAndAchievements}
                </div>
              </div>

              <div className="review-section">
                <h2>Areas for Improvement</h2>
                <div className="review-text">
                  {companyReview.areasForImprovement}
                </div>
              </div>

              {companyReview.additionalComments && (
                <div className="review-section">
                  <h2>Additional Comments</h2>
                  <div className="review-text">
                    {companyReview.additionalComments}
                  </div>
                </div>
              )}
            </div>

            <div className="status-actions">
              <h3>Update Review Status</h3>
              <div className="status-buttons">
                <button
                  className={`status-button accepted ${
                    currentStatus === "accepted" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("accepted")}
                >
                  Accept
                </button>
                <button
                  className={`status-button rejected ${
                    currentStatus === "rejected" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("rejected")}
                >
                  Reject
                </button>
                <button
                  className={`status-button flagged ${
                    currentStatus === "flagged" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("flagged")}
                >
                  Flag for Review
                </button>
                <button
                  className={`status-button pending ${
                    currentStatus === "pending" ? "active" : ""
                  }`}
                  onClick={() => updateReportStatus("pending")}
                >
                  Mark as Pending
                </button>
              </div>
              {statusMessage && (
                <div
                  className={`status-message ${
                    statusMessage.includes("Error") ? "error" : "success"
                  }`}
                >
                  {statusMessage}
                </div>
              )}
            </div>

            <div className="item-footer">
              <button className="back-button" onClick={() => navigate(-1)}>
                Back to Reports
              </button>
              <button
                className="dashboard-button"
                onClick={() => navigate("/ScadDashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
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
          <div className="item-container error">
            <p>🚫 Invalid item type requested.</p>
            <button className="back-button" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }
}

export default ViewInternshipItem;
