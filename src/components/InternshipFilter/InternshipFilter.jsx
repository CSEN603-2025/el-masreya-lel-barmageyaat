import React, { useState, useEffect } from 'react';
import './InternshipFilter.css';

function InternshipFilter({ 
  internships, 
  onFilterChange,
  showIndustryFilter = true,
  showDurationFilter = true,
  showPaidFilter = true,
  showTitleSearch = true,
  showCompanyFilter = true,
  showDateFilters = true,
  userType = 'student' // Can be 'student', 'proStudent', 'scad', or 'company'
}) {
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    paid: '',
    searchTerm: '',
    companyName: '',
    startDate: '',
    endDate: ''
  });

  // Customize filter interface based on user type
  const getFilterConfig = () => {
    switch(userType) {
      case 'proStudent':
        return {
          title: 'Pro Student Filter',
          showIndustry: true,
          showDuration: true,
          showPaid: true,
          showTitle: true,
          showCompany: true,
          showDates: true,
          className: 'pro-student-filter'
        };
      case 'scad':
        return {
          title: 'SCAD Office Filter',
          showIndustry: true,
          showDuration: true,
          showPaid: true,
          showTitle: true,
          showCompany: true,
          showDates: true,
          className: 'scad-filter'
        };
      case 'company':
        return {
          title: 'Company Filter',
          showIndustry: true,
          showDuration: true,
          showPaid: true,
          showTitle: true,
          showCompany: false,
          showDates: true,
          className: 'company-filter'
        };
      default: // student
        return {
          title: 'Student Filter',
          showIndustry: true,
          showDuration: true,
          showPaid: true,
          showTitle: true,
          showCompany: true,
          showDates: true,
          className: 'student-filter'
        };
    }
  };

  const filterConfig = getFilterConfig();

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

  // Format date to YYYY-MM-DD for filtering
  const formatDateForComparison = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
      
      // Start date filter
      if (filters.startDate && internship.startDate) {
        const filterStartDate = new Date(filters.startDate);
        const internshipStartDate = new Date(internship.startDate);
        if (internshipStartDate < filterStartDate) {
          return false;
        }
      }
      
      // End date filter
      if (filters.endDate && internship.endDate) {
        const filterEndDate = new Date(filters.endDate);
        const internshipEndDate = new Date(internship.endDate);
        if (internshipEndDate > filterEndDate) {
          return false;
        }
      } else if (filters.endDate && internship.startDate && internship.duration) {
        // Calculate approximate end date if endDate isn't provided
        const internshipStartDate = new Date(internship.startDate);
        // Extract duration number (assumes format like "3 months")
        const durationMatch = internship.duration.match(/(\d+)/);
        if (durationMatch) {
          const durationMonths = parseInt(durationMatch[0]);
          const estimatedEndDate = new Date(internshipStartDate);
          estimatedEndDate.setMonth(estimatedEndDate.getMonth() + durationMonths);
          const filterEndDate = new Date(filters.endDate);
          if (estimatedEndDate > filterEndDate) {
            return false;
          }
        }
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
      companyName: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className={`internship-filter ${filterConfig.className}`}>
      {filterConfig.title && (
        <h3 className="filter-title">{filterConfig.title}</h3>
      )}
      
      <div className="filter-section">
        {showTitleSearch && filterConfig.showTitle && (
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
        
        {showCompanyFilter && filterConfig.showCompany && (
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
        {showIndustryFilter && filterConfig.showIndustry && (
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
        
        {showDurationFilter && filterConfig.showDuration && (
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
        
        {showPaidFilter && filterConfig.showPaid && (
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
      
      {showDateFilters && filterConfig.showDates && (
        <div className="filter-section date-filters">
          <div className="filter-group">
            <label htmlFor="start-date">Start Date (after):</label>
            <input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="filter-input date-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="end-date">End Date (before):</label>
            <input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="filter-input date-input"
            />
          </div>
        </div>
      )}
      
      <button className="filter-reset" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
}

export default InternshipFilter; 