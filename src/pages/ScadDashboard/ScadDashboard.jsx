import React from "react";
import { Link } from "react-router-dom";
import "./ScadDashboard.css";

function ScadDashboard() {
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
        <div className="dashboard-header">
          <h1>SCAD Dashboard</h1>
          <div className="dashboard-actions">
            <div className="date-display">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon student-icon">👨‍🎓</div>
              <h2>Student Management</h2>
              <p>View and manage student profiles and internship progress.</p>
              <Link to="/AllStudents" className="card-button">
                View Students
              </Link>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon company-icon">🏢</div>
              <h2>Company Requests</h2>
              <p>Review and manage company registration requests.</p>
              <Link to="/ViewCompanyRequest" className="card-button">
                View Requests
              </Link>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon cycle-icon">🔄</div>
              <h2>Internship Cycle Management</h2>
              <p>Set the start and end dates for the current internship cycle and manage past cycles.</p>
              <Link to="/InternshipCycleSettings" className="card-button">
                Manage Cycles
              </Link>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon reports-icon">📊</div>
              <h2>Generate Reports</h2>
              <p>Create detailed reports about students, companies, and internship progress.</p>
              <Link to="/scad-reports" className="card-button">
                Generate Reports
              </Link>
            </div>
            
            <div className="dashboard-card">
              <div className="card-icon view-icon">📋</div>
              <h2>View Submitted Reports</h2>
              <p>Access and review all reports and evaluations submitted by students.</p>
              <Link to="/scad-submitted-reports" className="card-button">
                View Submissions
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ScadDashboard;
