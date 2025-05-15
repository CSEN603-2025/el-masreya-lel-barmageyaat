import React from "react";
import { Link } from "react-router-dom";
import StudentNotifications from "../StudentNotifications/StudentNotifications";
import "./StudentsNavBar.css"; // Make sure this line is added

function StudentsNavBar({ currUser, notifications, onMarkAsRead, onClearAll }) {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="navbar-links">
            <li>
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/studentsDashboard" className="navbar-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/studentProfile" className="navbar-link">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/login" className="navbar-link">
                Logout
              </Link>
            </li>
            <li>
              <Link to="/CompanyRegister" className="navbar-link">
                Company Register
              </Link>
            </li>
            <li>
              <Link to="/ViewCompanyRequest" className="navbar-link">
                View Company Request
              </Link>
            </li>
            <li>
              <Link to="/CompanyViewPostings" className="navbar-link">
                Company View Postings
              </Link>
            </li>
            <li>
              <Link to="/StudentsViewApplications" className="navbar-link">
                Internship Application
              </Link>
            </li>
          </ul>
          
          {currUser && (
            <div className="navbar-notifications">
              <StudentNotifications 
                notifications={notifications} 
                onMarkAsRead={onMarkAsRead}
                onClearAll={onClearAll}
              />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default StudentsNavBar;
