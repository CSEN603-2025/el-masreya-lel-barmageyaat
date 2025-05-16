import React, { useState } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import './ViewInternshipItem.css';

function ViewInternshipItem({ studentUsers, setStudentUsers, companyUsers }) {
  const { type, studentId, internshipId, companyUsername } = useParams();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  const [showInternshipDetails, setShowInternshipDetails] = useState(false);

  const student = studentUsers.find((s) => s.studentId === parseInt(studentId, 10));

  // Find company details for the internship
  const company = companyUsers ? companyUsers.find(c => c.username === companyUsername) : null;

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
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
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
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </main>
      </div>
    );
  }

  // Find the actual internship details from the company
  const internshipDetails = company?.internships?.find(i => i.id === internship.internshipId);

  // Function to update report status
  const updateReportStatus = (status) => {
    if (!setStudentUsers) {
      setStatusMessage('Error: Cannot update status (No setter function provided)');
      return;
    }
    
    // Create a deep copy of student users to avoid direct state mutation
    const updatedStudentUsers = JSON.parse(JSON.stringify(studentUsers));
    
    // Find the student and internship to update
    const studentIndex = updatedStudentUsers.findIndex(s => s.studentId === parseInt(studentId, 10));
    
    if (studentIndex === -1) {
      setStatusMessage('Error: Student not found');
      return;
    }
    
    const internshipIndex = updatedStudentUsers[studentIndex].appliedInternships.findIndex(
      i => i.internshipId === parseInt(internshipId, 10) && i.companyUsername === companyUsername
    );
    
    if (internshipIndex === -1) {
      setStatusMessage('Error: Internship not found');
      return;
    }
    
    // Update the report status
    if (type === 'report' && updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].report) {
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].report.status = status;
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].reportStatus = status;
      
      // Add a status update time
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].report.statusUpdatedAt = new Date().toISOString();
      
      // Add a notification to the student
      if (!updatedStudentUsers[studentIndex].notifications) {
        updatedStudentUsers[studentIndex].notifications = [];
      }
      
      updatedStudentUsers[studentIndex].notifications.push({
        id: Date.now(),
        message: `Your internship report has been ${status}`,
        read: false,
        date: new Date().toISOString()
      });
      
      // Update the state
      setStudentUsers(updatedStudentUsers);
      setStatusMessage(`Report status successfully updated to "${status}"`);
      
      // Save to localStorage (backup approach)
      try {
        localStorage.setItem('studentUsers', JSON.stringify(updatedStudentUsers));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    } else if (type === 'review' && updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].review) {
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].review.status = status;
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].reviewStatus = status;
      
      // Add a status update time
      updatedStudentUsers[studentIndex].appliedInternships[internshipIndex].review.statusUpdatedAt = new Date().toISOString();
      
      // Add a notification to the student
      if (!updatedStudentUsers[studentIndex].notifications) {
        updatedStudentUsers[studentIndex].notifications = [];
      }
      
      updatedStudentUsers[studentIndex].notifications.push({
        id: Date.now(),
        message: `Your internship evaluation has been ${status}`,
        read: false,
        date: new Date().toISOString()
      });
      
      // Update the state
      setStudentUsers(updatedStudentUsers);
      setStatusMessage(`Evaluation status successfully updated to "${status}"`);
      
      // Save to localStorage (backup approach)
      try {
        localStorage.setItem('studentUsers', JSON.stringify(updatedStudentUsers));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    } else {
      setStatusMessage(`Error: No ${type} found to update`);
    }
  };

  const getCurrentStatus = () => {
    if (type === 'report' && internship.report) {
      return internship.report.status || internship.reportStatus || 'pending';
    } else if (type === 'review' && internship.review) {
      return internship.review.status || internship.reviewStatus || 'pending';
    }
    return 'pending';
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render internship details section
  const renderInternshipDetails = () => {
    return (
      <div className="internship-details-section">
        <h3 onClick={() => setShowInternshipDetails(!showInternshipDetails)} className="collapsible-header">
          <span>Internship Details</span>
          <span className="toggle-icon">{showInternshipDetails ? '−' : '+'}</span>
        </h3>
        
        {showInternshipDetails && (
          <div className="internship-details-content">
            <div className="details-grid">
              <div className="detail-group">
                <h4>Company Information</h4>
                <div className="detail-item">
                  <span className="detail-label">Company Name:</span>
                  <span className="detail-value">{company?.name || companyUsername}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Industry:</span>
                  <span className="detail-value">{company?.industry || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{company?.location || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="detail-group">
                <h4>Position Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{internshipDetails?.title || internship.internshipTitle || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{internshipDetails?.department || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{internshipDetails?.duration || internship.duration || 'Not specified'}</span>
                </div>
                {internshipDetails?.stipend && (
                  <div className="detail-item">
                    <span className="detail-label">Stipend:</span>
                    <span className="detail-value">{internshipDetails.stipend}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="detail-group full-width">
              <h4>Timeline</h4>
              <div className="timeline-grid">
                <div className="detail-item">
                  <span className="detail-label">Applied On:</span>
                  <span className="detail-value">{formatDate(internship.appliedAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value">{formatDate(internship.startDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">End Date:</span>
                  <span className="detail-value">{formatDate(internship.endDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-value ${internship.internshipStatus?.toLowerCase() || 'pending'}`}>
                    {internship.internshipStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            
            {internshipDetails?.requirements && (
              <div className="detail-group full-width">
                <h4>Requirements</h4>
                <div className="detail-text">{internshipDetails.requirements}</div>
              </div>
            )}
            
            {internshipDetails?.description && (
              <div className="detail-group full-width">
                <h4>Description</h4>
                <div className="detail-text">{internshipDetails.description}</div>
              </div>
            )}
            
            <div className="detail-group full-width">
              <h4>Student Information</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Student ID:</span>
                  <span className="detail-value">{student.studentId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{student.firstName} {student.lastName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Major:</span>
                  <span className="detail-value">{student.major || 'Undeclared'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">{student.semester || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{student.email || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expected Graduation:</span>
                  <span className="detail-value">{student.graduationYear || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            {student.skills && student.skills.length > 0 && (
              <div className="detail-group full-width">
                <h4>Student Skills</h4>
                <div className="skills-list">
                  {student.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
              <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
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
                <p><strong>Student:</strong> {student.firstName} {student.lastName}</p>
                <p><strong>Major:</strong> {student.major || 'Undeclared'}</p>
                <p><strong>Submitted On:</strong> {new Date(report.date).toLocaleDateString()}</p>
                <div className="report-status-indicator">
                  <strong>Status:</strong> 
                  <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {renderInternshipDetails()}

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
              
              {report.learningOutcomes && (
                <div className="report-section">
                  <h2>Learning Outcomes</h2>
                  <div className="report-text">{report.learningOutcomes}</div>
                </div>
              )}
              
              {report.challenges && (
                <div className="report-section">
                  <h2>Challenges Faced</h2>
                  <div className="report-text">{report.challenges}</div>
                </div>
              )}
              
              {report.achievements && (
                <div className="report-section">
                  <h2>Key Achievements</h2>
                  <div className="report-text">{report.achievements}</div>
                </div>
              )}
              
              {report.relevantCourses && report.relevantCourses.length > 0 && (
                <div className="report-section">
                  <h2>Relevant Courses</h2>
                  <ul className="courses-list">
                    {report.relevantCourses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="status-actions">
              <h3>Update Report Status</h3>
              <div className="status-buttons">
                <button 
                  className={`status-button accepted ${currentStatus === 'accepted' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('accepted')}
                >
                  Accept
                </button>
                <button 
                  className={`status-button rejected ${currentStatus === 'rejected' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('rejected')}
                >
                  Reject
                </button>
                <button 
                  className={`status-button flagged ${currentStatus === 'flagged' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('flagged')}
                >
                  Flag for Review
                </button>
                <button 
                  className={`status-button pending ${currentStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('pending')}
                >
                  Mark as Pending
                </button>
              </div>
              {statusMessage && (
                <div className={`status-message ${statusMessage.includes('Error') ? 'error' : 'success'}`}>
                  {statusMessage}
                </div>
              )}
            </div>

            <div className="item-footer">
              <button className="back-button" onClick={() => navigate(-1)}>Back to Reports</button>
              <button className="dashboard-button" onClick={() => navigate('/ScadDashboard')}>Dashboard</button>
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
              <p>🚫 No evaluation found for this internship.</p>
              <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
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
              <h1>⭐ Internship Evaluation</h1>
              <div className="student-info">
                <p><strong>Student:</strong> {student.firstName} {student.lastName}</p>
                <p><strong>Major:</strong> {student.major || 'Undeclared'}</p>
                <p><strong>Submitted On:</strong> {new Date(review.date).toLocaleDateString()}</p>
                <div className="report-status-indicator">
                  <strong>Status:</strong> 
                  <span className={`status-badge ${currentStatus}`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {renderInternshipDetails()}

            <div className="review-content">
              <div className="review-section">
                <h2>Summary</h2>
                <div className="review-text">{review.content}</div>
              </div>
              
              <div className="review-details">
                <div className="review-item">
                  <span className="review-label">Rating:</span>
                  <span className="review-value">{review.rating}/5</span>
        </div>

                {review.duration && (
                  <div className="review-item">
                    <span className="review-label">Duration:</span>
                    <span className="review-value">{review.duration}</span>
                  </div>
                )}
                
                {review.recommend && (
                  <div className="review-item">
                    <span className="review-label">Would Recommend:</span>
                    <span className="review-value">{review.recommend === 'yes' ? 'Yes' : 'No'}</span>
                  </div>
                )}
                
                {review.major && (
                  <div className="review-item">
                    <span className="review-label">Related Major:</span>
                    <span className="review-value">{review.major}</span>
                  </div>
                )}
              </div>
              
              {review.skillsGained && review.skillsGained.length > 0 && (
                <div className="review-section">
                  <h2>Skills Gained</h2>
                  <div className="skills-list">
                    {review.skillsGained.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
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

              {review.feedback && (
                <div className="review-section">
                  <h2>Supervisor Feedback</h2>
                  <div className="review-text">{review.feedback}</div>
                </div>
              )}
            </div>

            <div className="status-actions">
              <h3>Update Evaluation Status</h3>
              <div className="status-buttons">
                <button 
                  className={`status-button accepted ${currentStatus === 'accepted' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('accepted')}
                >
                  Accept
                </button>
                <button 
                  className={`status-button rejected ${currentStatus === 'rejected' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('rejected')}
                >
                  Reject
                </button>
                <button 
                  className={`status-button flagged ${currentStatus === 'flagged' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('flagged')}
                >
                  Flag for Review
                </button>
                <button 
                  className={`status-button pending ${currentStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => updateReportStatus('pending')}
                >
                  Mark as Pending
                </button>
              </div>
              {statusMessage && (
                <div className={`status-message ${statusMessage.includes('Error') ? 'error' : 'success'}`}>
                  {statusMessage}
                </div>
              )}
            </div>

            <div className="item-footer">
              <button className="back-button" onClick={() => navigate(-1)}>Back to Reports</button>
              <button className="dashboard-button" onClick={() => navigate('/ScadDashboard')}>Dashboard</button>
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
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </main>
      </div>
    );
  }
}

export default ViewInternshipItem;
