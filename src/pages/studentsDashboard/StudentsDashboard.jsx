import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import InternshipList from "../../components/InternshipList/InternshipList";
import InternshipFilter from "../../components/InternshipFilter/InternshipFilter";
import { useEffect, useMemo, useState } from "react";
import "./StudentsDashboard.css";

function StudentsDashboard({ companyUsers }) {
  const allInternships = useMemo(() => {
    return companyUsers.flatMap((company) => {
      // Add company industry to each internship
      return company.internships.map(internship => ({
        ...internship,
        industry: company.industry || 'Not specified',
        // Add default start dates if not present for filtering
        startDate: internship.startDate || '2023-01-15',
        endDate: internship.endDate || null
      }));
    });
  }, [companyUsers]);

  const [filteredInternships, setFilteredInternships] = useState(allInternships);
  
  // Function to handle filter changes from the InternshipFilter component
  const handleFilterChange = (filteredResults) => {
    setFilteredInternships(filteredResults);
  };

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
        <Link to="/FilterDemo" className="action-button view-filters">
          View All Filters
        </Link>
      </div>

      <div className="filter-container">
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={handleFilterChange}
          userType="student"
          showDateFilters={true}
        />
      </div>

      <div className="internship-list">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship) => (
            <InternshipList
              internship={internship}
              key={internship.companyName + internship.title}
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
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/studentProfile" className="nav-link">Student Profile</Link>
        <Link to="/SuggestedCompanies" className="nav-link suggested-link">View Suggested Companies</Link>
      </div>
    </div>
  );
}

export default StudentsDashboard;
