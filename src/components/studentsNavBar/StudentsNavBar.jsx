import { Link } from "react-router-dom";

function StudentsNavBar() {
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/studentsDashboard">Dashboard</Link>
            <Link to="/studentProfile">Profile</Link>
            <Link to="/login">Logout</Link>
            <Link to="/CompanyRegister">Company Register</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default StudentsNavBar;
