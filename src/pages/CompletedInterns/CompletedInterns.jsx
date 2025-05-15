import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CompletedInterns.css';

function CompletedInterns({ companyUsers, currUser }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('completionDate'); // 'completionDate', 'name'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'lastMonth', 'last3Months', 'last6Months', 'lastYear'

  if (!currUser) {
    navigate('/login');
    return null;
  }

  // Get current company's data
  const companyData = companyUsers.find(company => company.username === currUser.username);
  
  // Get all completed interns from all internships
  const completedInterns = companyData?.internships?.flatMap(internship => 
    (internship.applications || [])
      .filter(application => application.internshipStatus === "InternshipComplete")
      .map(application => ({
        ...application,
        internshipTitle: internship.title,
        internshipId: internship.internshipID
      }))
  ) || [];

  // Filter interns based on completion date
  const filterInternsByTime = (interns) => {
    const now = new Date();
    return interns.filter(intern => {
      const completionDate = new Date(intern.completionDate);
      const monthsDiff = (now.getFullYear() - completionDate.getFullYear()) * 12 + 
                        (now.getMonth() - completionDate.getMonth());
      
      switch(timeFilter) {
        case 'lastMonth':
          return monthsDiff <= 1;
        case 'last3Months':
          return monthsDiff <= 3;
        case 'last6Months':
          return monthsDiff <= 6;
        case 'lastYear':
          return monthsDiff <= 12;
        default:
          return true;
      }
    });
  };

  // Sort interns
  const sortedInterns = [...filterInternsByTime(completedInterns)].sort((a, b) => {
    if (sortBy === 'completionDate') {
      return new Date(b.completionDate) - new Date(a.completionDate);
    }
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  // Filter interns based on search
  const filteredInterns = sortedInterns.filter(intern => {
    const searchString = searchTerm.toLowerCase();
    const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
    const internshipTitle = intern.internshipTitle.toLowerCase();
    
    return fullName.includes(searchString) || internshipTitle.includes(searchString);
  });

  return (
    <div className="completed-interns-container">
      <div className="completed-interns-header">
        <h1>Past Completed Internships</h1>
        <div className="header-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or internship..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-filter-select"
            >
              <option value="all">All Time</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="completionDate">Most Recent First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="completed-interns-stats">
        <div className="stat-card">
          <h3>Total Past Interns</h3>
          <p className="stat-number">{completedInterns.length}</p>
        </div>
        <div className="stat-card">
          <h3>Selected Period</h3>
          <p className="stat-number">{filteredInterns.length}</p>
        </div>
      </div>

      <div className="completed-interns-list">
        {filteredInterns.length > 0 ? (
          filteredInterns.map((intern) => (
            <div key={`${intern.username}-${intern.internshipId}`} className="intern-card">
              <div className="intern-info">
                <div className="intern-primary-info">
                  <h2>{intern.firstName} {intern.lastName}</h2>
                  <span className="completion-date">
                    Completed: {new Date(intern.completionDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="intern-details">
                  <p><strong>Past Internship:</strong> {intern.internshipTitle}</p>
                  <p><strong>Email:</strong> {intern.email}</p>
                </div>
                <div className="intern-skills">
                  {intern.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="intern-actions">
                <Link 
                  to={`/intern-evaluation/${intern.username}`}
                  className="action-button"
                >
                  View Past Evaluation
                </Link>
                <Link 
                  to={`/intern-report/${intern.username}`}
                  className="action-button"
                >
                  View Final Report
                </Link>
                <Link 
                  to={`/applicant/${intern.username}`}
                  className="action-button view-details"
                >
                  View Full History
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-interns">
            {searchTerm ? (
              <p>No past interns match your search.</p>
            ) : (
              <p>No completed internships found for the selected time period.</p>
            )}
          </div>
        )}
      </div>

      <div className="navigation-footer">
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
}

export default CompletedInterns; 