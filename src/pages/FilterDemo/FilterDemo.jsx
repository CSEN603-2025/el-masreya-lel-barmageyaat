import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import InternshipFilter from '../../components/InternshipFilter/InternshipFilter';
import './FilterDemo.css';

function FilterDemo({ companyUsers }) {
  // Extract all internships from all companies with dates for filtering
  const allInternships = useMemo(() => {
    return companyUsers.flatMap(company => 
      company.internships.map(internship => ({
        ...internship,
        industry: company.industry || 'Not specified',
        companyName: company.name || company.username,
        // Add default start dates and durations if not present
        startDate: internship.startDate || '2023-01-15',
        endDate: internship.endDate || null
      }))
    );
  }, [companyUsers]);

  // Create states for each filter type
  const [studentFiltered, setStudentFiltered] = useState(allInternships);
  const [proStudentFiltered, setProStudentFiltered] = useState(allInternships);
  const [scadFiltered, setScadFiltered] = useState(allInternships);
  const [companyFiltered, setCompanyFiltered] = useState(allInternships);

  return (
    <div className="filter-demo-container">
      <h1>Internship Filter Demo</h1>
      <p className="demo-description">
        This page demonstrates the four different filter interfaces for Student, Pro Student, 
        SCAD Office, and Company users. Each filter has been styled and configured 
        based on the specific needs of that user type.
      </p>

      <div className="filter-section-container">
        <h2>Student Filter</h2>
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={setStudentFiltered}
          userType="student"
        />
        <div className="results-counter">
          <span>{studentFiltered.length} internships found</span>
        </div>
      </div>

      <div className="filter-section-container">
        <h2>Pro Student Filter</h2>
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={setProStudentFiltered}
          userType="proStudent"
        />
        <div className="results-counter">
          <span>{proStudentFiltered.length} internships found</span>
        </div>
      </div>

      <div className="filter-section-container">
        <h2>SCAD Office Filter</h2>
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={setScadFiltered}
          userType="scad"
        />
        <div className="results-counter">
          <span>{scadFiltered.length} internships found</span>
        </div>
      </div>

      <div className="filter-section-container">
        <h2>Company Filter</h2>
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={setCompanyFiltered}
          userType="company"
        />
        <div className="results-counter">
          <span>{companyFiltered.length} internships found</span>
        </div>
      </div>

      <div className="navigation-links">
        <Link to="/" className="nav-link">Back to Home</Link>
      </div>
    </div>
  );
}

export default FilterDemo; 