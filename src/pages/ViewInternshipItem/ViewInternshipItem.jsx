import React from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import './ViewInternshipItem.css';

function ViewInternshipItem({ studentUsers }) {
  const { type, studentId, internshipId, companyUsername } = useParams();
  const navigate = useNavigate();

  const student = studentUsers.find((s) => s.studentId === parseInt(studentId, 10));

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
                <p><strong>Submitted On:</strong> {new Date(report.date).toLocaleDateString()}</p>
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
                <p><strong>Submitted On:</strong> {new Date(review.date).toLocaleDateString()}</p>
              </div>
            </div>

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
