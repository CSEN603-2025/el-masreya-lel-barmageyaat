import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import InternshipList from "../../components/InternshipList/InternshipList";
import InternshipFilter from "../../components/InternshipFilter/InternshipFilter";
import { useEffect, useMemo, useState, useCallback } from "react";

import "./StudentsDashboard.css";

function StudentsDashboard({ companyUsers }) {
  const allInternships = useMemo(() => {
    if (!companyUsers) return [];
    return companyUsers.flatMap((company) =>
      company.internships.map((internship) => ({
        ...internship,
        industry: company.industry || "Not specified",
      }))
    );
  }, [companyUsers]);

  const [filteredInternships, setFilteredInternships] = useState([]);

  // Set filtered internships when allInternships changes
  useEffect(() => {
    // Only set state if different (to avoid endless loop)
    setFilteredInternships((prev) => {
      const newList = allInternships;
      const sameLength = prev.length === newList.length;
      const sameItems =
        sameLength && prev.every((item, idx) => item.id === newList[idx].id);

      return sameItems ? prev : newList;
    });
  }, [allInternships]);

  // Function to handle filter changes from the InternshipFilter component

  const handleFilterChange = useCallback((filteredResults) => {
    setFilteredInternships(filteredResults);
  }, []);

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

      <div className="filter-container">
        <h2>Filter Internships</h2>
        <InternshipFilter
          internships={allInternships}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="internship-list">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship) => (
            <InternshipList
              internship={internship}
              key={internship.id || internship.companyName + internship.title}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No internships found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <div className="navigation-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/studentProfile" className="nav-link">
          Student Profile
        </Link>
        <Link to="/SuggestedCompanies" className="nav-link suggested-link">
          View Suggested Companies
        </Link>
      </div>
    </div>
  );
}

export default StudentsDashboard;
