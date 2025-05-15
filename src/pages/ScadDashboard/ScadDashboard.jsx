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
        <p>Placeholder for content based on selected tab.</p>
      </main>
    </div>
  );
}

export default ScadDashboard;
