import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import InternshipFilter from '../../components/InternshipFilter/InternshipFilter';
import InternshipList from '../../components/InternshipList/InternshipList';
import './ViewCompanyPostings.css';

function ViewCompanyPostings({ companyUsers }) {
  // Extract all internships from all companies
  const allInternships = useMemo(() => {
    return companyUsers.flatMap(company => 
      company.internships.map(internship => ({
        ...internship,
        industry: company.industry || 'Not specified',
        companyName: company.name || company.username,
        // Add default start dates if not present for filtering
        startDate: internship.startDate || '2023-01-15',
        endDate: internship.endDate || null
      }))
    );
  }, [companyUsers]);

  const [filteredInternships, setFilteredInternships] = useState(allInternships);
  const [activeCompany, setActiveCompany] = useState('');

  // Function to handle filter changes
  const handleFilterChange = (filteredResults) => {
    setFilteredInternships(filteredResults);
  };

  // Get unique company names for the company filter
  const companyNames = [...new Set(companyUsers.map(company => 
    company.name || company.username
  ))];

  // Filter by company
  const handleCompanyFilter = (companyName) => {
    setActiveCompany(companyName);
    
    if (!companyName) {
      // If no company selected, reset to all internships
      setFilteredInternships(allInternships);
    } else {
      // Filter internships by selected company
      const companyInternships = allInternships.filter(
        internship => internship.companyName === companyName
      );
      setFilteredInternships(companyInternships);
    }
  };

  return (
    <div className="view-postings-container">
      <h1>SCAD Office - Company Postings</h1>
      
      <div className="dashboard-actions">
        <div className="company-filters">
          <h2>Filter by Company</h2>
          <div className="company-buttons">
            <button 
              className={`company-filter-btn ${activeCompany === '' ? 'active' : ''}`}
              onClick={() => handleCompanyFilter('')}
            >
              All Companies
            </button>
            
            {companyNames.map((company, index) => (
              <button 
                key={index}
                className={`company-filter-btn ${activeCompany === company ? 'active' : ''}`}
                onClick={() => handleCompanyFilter(company)}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
        
        <Link to="/FilterDemo" className="action-button view-filters">
          View All Filters
        </Link>
      </div>

      <div className="filter-container">
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={handleFilterChange}
          showCompanyFilter={false}
          userType="scad"
        />
      </div>

      <div className="internships-container">
        <h2>Internship Listings {activeCompany && `- ${activeCompany}`}</h2>
        
        {filteredInternships.length > 0 ? (
          <div className="internship-list">
            {filteredInternships.map((internship) => (
              <InternshipList
                key={`${internship.internshipID}-${internship.companyName}`}
                internship={internship}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No internships found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <div className="navigation-links">
        <Link to="/ScadDashboard" className="nav-link">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default ViewCompanyPostings; 