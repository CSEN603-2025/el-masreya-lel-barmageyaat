import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import InternshipList from "../../components/InternshipList/InternshipList";
import { useEffect, useMemo, useState } from "react";
import "./StudentsDashboard.css";

function StudentsDashboard({ companyUsers }) {
  const allInternships = useMemo(() => {
    return companyUsers.flatMap((company) => company.internships);
  }, [companyUsers]);

  const [filteredInternships, setFilteredInternships] =
    useState(allInternships);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  useEffect(() => {
    const filtered = allInternships.filter((internship) => {
      return (
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredInternships(filtered);
  }, [filterTerm, searchTerm, allInternships]);

  return (
    <div className="students-dashboard">
      <StudentsNavBar />
      <h1>Students Dashboard</h1>

      <div className="dashboard-actions">
        <Link to="/studentProfile" className="action-button view-profile">
          View/Edit Profile
        </Link>
        <Link to="/studentProfile" className="action-button view-majors">
          View Majors & Semesters
        </Link>
        <Link to="/SuggestedCompanies" className="action-button view-suggested">
          Suggested Companies
        </Link>
      </div>

      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Filter by company name"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="internship-list">
        {filteredInternships.map((internship) => (
          <InternshipList
            internship={internship}
            key={internship.companyName + internship.title}
          />
        ))}
      </div>

      <div className="navigation-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/studentProfile" className="nav-link">Student Profile</Link>
        <Link to="/SuggestedCompanies" className="nav-link suggested-link">View Suggested Companies</Link>
      </div>
    </div>
  );
}

export default StudentsDashboard;
