import React, { useState, useEffect } from 'react';
import './InternshipFilter.css';

function InternshipFilter({ 
  internships, 
  onFilterChange,
  showIndustryFilter = true,
  showDurationFilter = true,
  showPaidFilter = true,
  showTitleSearch = true,
  showCompanyFilter = true
}) {
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    paid: '',
    searchTerm: '',
    companyName: ''
  });

  // Get unique industries from all internships
  const industries = [...new Set(internships
    .filter(internship => internship.industry)
    .map(internship => internship.industry))
  ];

  // Get unique durations from all internships
  const durations = [...new Set(internships
    .filter(internship => internship.duration)
    .map(internship => internship.duration))
  ];

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Apply filters whenever they change
  useEffect(() => {
    const filteredInternships = internships.filter(internship => {
      // Industry filter
      if (filters.industry && internship.industry !== filters.industry) {
        return false;
      }
      
      // Duration filter
      if (filters.duration && internship.duration !== filters.duration) {
        return false;
      }
      
      // Paid/Unpaid filter
      if (filters.paid) {
        const isPaid = filters.paid === 'paid';
        if (internship.paid !== isPaid) {
          return false;
        }
      }
      
      // Search term for title
      if (filters.searchTerm && !internship.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Company name filter
      if (filters.companyName && !internship.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    onFilterChange(filteredInternships);
  }, [filters, internships, onFilterChange]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      industry: '',
      duration: '',
      paid: '',
      searchTerm: '',
      companyName: ''
    });
  };

  return (
    <div className="internship-filter">
      <div className="filter-section">
        {showTitleSearch && (
          <div className="filter-group">
            <label htmlFor="search-term">Title Search:</label>
            <input
              id="search-term"
              type="text"
              placeholder="Search by title"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="filter-input"
            />
          </div>
        )}
        
        {showCompanyFilter && (
          <div className="filter-group">
            <label htmlFor="company-name">Company:</label>
            <input
              id="company-name"
              type="text"
              placeholder="Filter by company"
              value={filters.companyName}
              onChange={(e) => handleFilterChange('companyName', e.target.value)}
              className="filter-input"
            />
          </div>
        )}
      </div>
      
      <div className="filter-section">
        {showIndustryFilter && (
          <div className="filter-group">
            <label htmlFor="industry">Industry:</label>
            <select
              id="industry"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="filter-select"
            >
              <option value="">All Industries</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        )}
        
        {showDurationFilter && (
          <div className="filter-group">
            <label htmlFor="duration">Duration:</label>
            <select
              id="duration"
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              className="filter-select"
            >
              <option value="">All Durations</option>
              {durations.map((duration, index) => (
                <option key={index} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
        )}
        
        {showPaidFilter && (
          <div className="filter-group">
            <label htmlFor="paid">Compensation:</label>
            <select
              id="paid"
              value={filters.paid}
              onChange={(e) => handleFilterChange('paid', e.target.value)}
              className="filter-select"
            >
              <option value="">All Internships</option>
              <option value="paid">Paid Only</option>
              <option value="unpaid">Unpaid Only</option>
            </select>
          </div>
        )}
      </div>
      
      <button className="filter-reset" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
}

export default InternshipFilter; 