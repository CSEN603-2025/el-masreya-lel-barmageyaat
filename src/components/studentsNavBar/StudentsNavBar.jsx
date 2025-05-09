import { Link } from "react-router-dom";
import "./StudentsNavBar.css"; // Make sure this line is added

function StudentsNavBar() {
  return (
    <div>
      <nav className="navbar">
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
      </nav>
    </div>
  );
}

export default StudentsNavBar;
