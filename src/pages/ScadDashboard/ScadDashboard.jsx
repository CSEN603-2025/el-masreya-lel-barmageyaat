import React from "react";
import { Link } from "react-router-dom";
import "./ScadDashboard.css";

function ScadDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>SCAD Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="/ScadDashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/">Companies</Link>
            </li>
            <li>
              <Link to="/AllStudents">Students</Link>
            </li>
            <li>
              <Link to="/">Job Posts</Link>
            </li>
            <li>
              <Link to="/ViewCompanyRequest">Company Requests</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <h1>This is the SCAD Dashboard</h1>
        
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Internship Cycle Management</h2>
            <p>Set the start and end dates for the current internship cycle and manage past cycles.</p>
            <Link to="/InternshipCycleSettings" className="card-button">
              Manage Internship Cycles
            </Link>
          </div>
          
          <div className="dashboard-card">
            <h2>Generate Reports</h2>
            <p>Create detailed reports about students, companies, and internship progress.</p>
            <Link to="/scad-reports" className="card-button">
              Go to Reports
            </Link>
          </div>
          
          <div className="dashboard-card">
            <h2>Company Requests</h2>
            <p>Review and manage company registration requests.</p>
            <Link to="/ViewCompanyRequest" className="card-button">
              View Requests
            </Link>
          </div>
          
          <div className="dashboard-card">
            <h2>Student Management</h2>
            <p>View and manage student profiles and internship progress.</p>
            <Link to="/AllStudents" className="card-button">
              View Students
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ScadDashboard;
