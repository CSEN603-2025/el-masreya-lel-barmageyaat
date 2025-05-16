import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ScadSubmittedReports.css';

function ScadSubmittedReports({ studentUsers, companyUsers }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Collect all submitted reports from students
  const allReports = useMemo(() => {
    const reports = [];
    
    studentUsers.forEach(student => {
      if (student.appliedInternships) {
        student.appliedInternships.forEach(internship => {
          // Check if this internship has a review or report
          if (internship.review || internship.report) {
            // Find the company
            const company = companyUsers.find(c => c.username === internship.companyUsername);
            
            // Find the internship details
            const internshipDetails = company?.internships?.find(i => i.id === internship.internshipId);
            
            reports.push({
              id: `${student.studentId}-${internship.internshipId}-${internship.companyUsername}`,
              studentId: student.studentId,
              studentName: `${student.firstName} ${student.lastName}`,
              companyName: company?.name || internship.companyUsername,
              internshipId: internship.internshipId,
              companyUsername: internship.companyUsername,
              internshipTitle: internshipDetails?.title || internship.internshipTitle || 'Internship',
              date: internship.review?.date || internship.report?.date || internship.appliedAt,
              hasReview: !!internship.review,
              hasReport: !!internship.report,
              status: internship.internshipStatus || 'Unknown'
            });
          }
        });
      }
    });
    
    return reports;
  }, [studentUsers, companyUsers]);

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = [...allReports];
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(report => {
        if (filter === 'review') return report.hasReview;
        if (filter === 'report') return report.hasReport;
        if (filter === 'both') return report.hasReview && report.hasReport;
        if (filter === 'completed') return report.status === 'InternshipComplete';
        return true;
      });
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.studentName.toLowerCase().includes(term) || 
        report.companyName.toLowerCase().includes(term) ||
        report.internshipTitle.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'student') {
        comparison = a.studentName.localeCompare(b.studentName);
      } else if (sortBy === 'company') {
        comparison = a.companyName.localeCompare(b.companyName);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [allReports, filter, searchTerm, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCAD Office</h2>
          <div className="sidebar-divider"></div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/login">
                <i className="nav-icon logout-icon">🚪</i>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© 2023 SCAD Office</p>
        </div>
      </aside>
      
      <main className="dashboard-main">
        <div className="scad-reports-container">
          <h1>Submitted Internship Reports</h1>
          <p className="reports-description">
            View and manage all reports and evaluations submitted by students after completing their internships.
          </p>
          
          <div className="reports-controls">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search by student, company, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Submissions</option>
                <option value="review">Has Evaluation</option>
                <option value="report">Has Report</option>
                <option value="both">Has Both</option>
                <option value="completed">Completed Internships</option>
              </select>
            </div>
            
            <div className="sort-controls">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Submission Date</option>
                <option value="student">Student Name</option>
                <option value="company">Company Name</option>
              </select>
              
              <button 
                className="sort-order-button" 
                onClick={toggleSortOrder}
                aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="no-reports">
              <p>No reports found matching your criteria.</p>
            </div>
          ) : (
            <div className="reports-list">
              <div className="reports-header">
                <div className="header-student">Student</div>
                <div className="header-company">Company</div>
                <div className="header-internship">Internship</div>
                <div className="header-date">Date</div>
                <div className="header-documents">Documents</div>
                <div className="header-actions">Actions</div>
              </div>
              
              {filteredReports.map(report => (
                <div key={report.id} className="report-item">
                  <div className="report-student">{report.studentName}</div>
                  <div className="report-company">{report.companyName}</div>
                  <div className="report-internship">{report.internshipTitle}</div>
                  <div className="report-date">{new Date(report.date).toLocaleDateString()}</div>
                  <div className="report-documents">
                    {report.hasReport && <span className="document-badge report">Report</span>}
                    {report.hasReview && <span className="document-badge review">Evaluation</span>}
                  </div>
                  <div className="report-actions">
                    {report.hasReport && (
                      <Link 
                        to={`/scad/viewInternshipItem/report/${report.studentId}/${report.internshipId}/${report.companyUsername}`}
                        className="view-button report"
                      >
                        View Report
                      </Link>
                    )}
                    {report.hasReview && (
                      <Link 
                        to={`/scad/viewInternshipItem/review/${report.studentId}/${report.internshipId}/${report.companyUsername}`}
                        className="view-button review"
                      >
                        View Evaluation
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="reports-summary">
            <p>Total submissions: <strong>{filteredReports.length}</strong> of {allReports.length}</p>
            <p>
              Reports: <strong>{filteredReports.filter(r => r.hasReport).length}</strong> | 
              Evaluations: <strong>{filteredReports.filter(r => r.hasReview).length}</strong> | 
              Complete submissions: <strong>{filteredReports.filter(r => r.hasReport && r.hasReview).length}</strong>
            </p>
          </div>
          
          <div className="navigation-footer">
            <button onClick={() => navigate('/ScadDashboard')} className="back-button">
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ScadSubmittedReports; 