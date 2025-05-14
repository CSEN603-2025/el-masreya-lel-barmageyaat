import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InternshipList from "../../components/InternshipList/InternshipList";
import CompanyNotifications from "../../components/CompanyNotifications/CompanyNotifications";
import "./CompanyViewPostings.css";

function CompanyViewPostings({ currUser, addNotification, companyUsers, setCompanyUsers }) {
  const navigate = useNavigate();
  const [selectedInternship, setSelectedInternship] = useState('all');
  const [filteredInternships, setFilteredInternships] = useState([]);
  
  // Check if the user is logged in
  useEffect(() => {
    if (!currUser) {
      navigate("/login");
    }
  }, [currUser, navigate]);
  
  // Initialize and filter internships
  useEffect(() => {
    if (currUser?.internships) {
      if (selectedInternship === 'all') {
        setFilteredInternships(currUser.internships);
      } else {
        setFilteredInternships(
          currUser.internships.filter(
            internship => internship.internshipID === parseInt(selectedInternship)
          )
        );
      }
    }
  }, [currUser, selectedInternship]);
  
  // Always show acceptance notification on dashboard load
  useEffect(() => {
    if (currUser && addNotification) {
      // Add a slight delay to ensure the notification is visible
      setTimeout(() => {
        addNotification("Welcome to your company dashboard!", "success");
      }, 500);
    }
  }, []); // Empty dependency array ensures this runs only once on component mount
  
  // Handler for marking notifications as read
  const handleMarkAsRead = (notificationId) => {
    if (currUser && setCompanyUsers) {
      const updatedUsers = companyUsers.map(company => {
        if (company.username === currUser.username) {
          return {
            ...company,
            notifications: (company.notifications || []).map(notification => 
              notification.id === notificationId 
                ? { ...notification, read: true } 
                : notification
            )
          };
        }
        return company;
      });
      
      setCompanyUsers(updatedUsers);
    }
  };
  
  // Handler for clearing all notifications
  const handleClearAll = () => {
    if (currUser && setCompanyUsers) {
      const updatedUsers = companyUsers.map(company => {
        if (company.username === currUser.username) {
          return {
            ...company,
            notifications: []
          };
        }
        return company;
      });
      
      setCompanyUsers(updatedUsers);
    }
  };
  
  // Get company data including notifications
  const companyData = companyUsers.find(company => company.username === currUser?.username);
  const companyNotifications = companyData?.notifications || [];

  if (!currUser) {
    return <div className="loading-message">Please log in to view your company dashboard.</div>;
  }

  // Calculate total applications for each internship
  const getTotalApplications = (internship) => {
    return internship.applications?.length || 0;
  };

  // Calculate total applications across all internships
  const totalApplications = currUser.internships?.reduce((total, internship) => 
    total + getTotalApplications(internship), 0) || 0;

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h1>Company Dashboard</h1>
        <div className="dashboard-controls">
          <CompanyNotifications 
            notifications={companyNotifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
      
      <div className="company-info">
        <h2>{currUser.name}</h2>
        <p><strong>Industry:</strong> {currUser.industry || "Not specified"}</p>
        <p><strong>Size:</strong> {currUser.Size || "Not specified"}</p>
        <p><strong>Email:</strong> {currUser.email || "Not specified"}</p>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/createInternship" className="action-button create-internship">
          Create New Internship
        </Link>
        <Link to="/myInterns" className="action-button view-interns">
          View My Interns
        </Link>
        <Link to="/completed-interns" className="action-button view-completed">
          View Completed Interns
        </Link>
        <Link to="/companyProfile" className="action-button edit-profile">
          Edit Company Profile
        </Link>
      </div>
      
      <div className="internship-filter-section">
        <h2 className="section-title">Your Internship Postings</h2>
        <div className="filter-controls">
          <label htmlFor="internship-filter">Filter by Internship: </label>
          <select 
            id="internship-filter"
            value={selectedInternship}
            onChange={(e) => setSelectedInternship(e.target.value)}
            className="internship-filter-select"
          >
            <option value="all">All Internships ({totalApplications} total applications)</option>
            {currUser.internships?.map((internship) => (
              <option key={internship.internshipID} value={internship.internshipID}>
                {internship.title} ({getTotalApplications(internship)} applications)
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="email-notification-alert">
        <div className="email-notification-content">
          <div className="email-icon">📧</div>
          <div className="email-info">
            <h3>Email Notifications Enabled</h3>
            <p>You will receive email notifications when students apply to your internships.</p>
          </div>
        </div>
      </div>
      
      <div className="internship-listings">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship, index) => (
            <div key={index} className="internship-listing-container">
              <InternshipList internship={internship} />
              <div className="internship-stats">
                <div className="stat-item">
                  <span className="stat-label">Applications:</span>
                  <span className="stat-value">{internship.applications?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Status:</span>
                  <span className={`stat-value status-${internship.status?.toLowerCase() || 'active'}`}>
                    {internship.status || 'Active'}
                  </span>
                </div>
                <Link to={`/viewApplications/${internship.internshipID}`} className="view-applications-btn">
                  View Applications
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-internships">
            <p>You haven't posted any internships yet.</p>
            <Link to="/createInternship" className="create-first-internship">
              Create Your First Internship
            </Link>
          </div>
        )}
      </div>
      
      {/* Email notification view */}
      <div className="sent-emails-section">
        <h2 className="section-title">Recent Email Notifications</h2>
        <div className="email-list">
          {/* This would display recently sent emails in a real app */}
          <div className="email-preview">
            <p className="email-recipient">To: {currUser.email || currUser.username}</p>
            <p className="email-subject">Subject: Welcome to El-Masreya-Lel-Barmageyaat!</p>
            <p className="email-timestamp">Sent: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="view-all-emails">
            <p>Email notifications will be sent to your registered email address.</p>
          </div>
        </div>
      </div>
      
      <div className="navigation-footer">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

export default CompanyViewPostings;
