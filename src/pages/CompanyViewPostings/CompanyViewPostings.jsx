import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InternshipList from "../../components/InternshipList/InternshipList";
import "./CompanyViewPostings.css";

function CompanyViewPostings({ currUser, addNotification, companyUsers, setCompanyUsers }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(true); // Show notifications by default
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Check if the user is logged in
  useEffect(() => {
    if (!currUser) {
      navigate("/login");
    }
  }, [currUser, navigate]);
  
  // Always show acceptance notification on dashboard load
  useEffect(() => {
    if (currUser && addNotification) {
      // Add a slight delay to ensure the notification is visible
      setTimeout(() => {
        addNotification("Your company application has been accepted!", "success");
      }, 500);
    }
  }, []); // Empty dependency array ensures this runs only once on component mount
  
  // Calculate notification count
  useEffect(() => {
    if (currUser && currUser.internships) {
      let count = 0;
      currUser.internships.forEach(internship => {
        if (internship.applications) {
          count += internship.applications.filter(app => 
            (app.status === "accepted" || app.status === "rejected") && 
            !app.statusNotified
          ).length;
        }
      });
      setNotificationCount(count);
    }
  }, [currUser]);
  
  // Check for application status changes
  useEffect(() => {
    if (currUser && currUser.internships && setCompanyUsers) {
      // Look for applications that haven't been notified yet
      let hasUnnotifiedApplications = false;
      
      currUser.internships.forEach(internship => {
        if (internship.applications) {
          internship.applications.forEach(application => {
            if ((application.status === "accepted" || application.status === "rejected") && !application.statusNotified) {
              hasUnnotifiedApplications = true;
              
              // For accepted applications
              if (application.status === "accepted") {
                addNotification(
                  `Application from ${application.firstName} ${application.lastName} has been accepted.`,
                  "success"
                );
              }
              // For rejected applications
              else if (application.status === "rejected") {
                addNotification(
                  `Application from ${application.firstName} ${application.lastName} has been rejected.`,
                  "error"
                );
              }
            }
          });
        }
      });
      
      // Mark all applications as notified
      if (hasUnnotifiedApplications) {
        // Only update if there are unnotified applications
        const updatedUsers = companyUsers.map(company => {
          if (company.username === currUser.username) {
            return {
              ...company,
              internships: company.internships.map(internship => ({
                ...internship,
                applications: internship.applications?.map(app => ({
                  ...app,
                  statusNotified: true // Mark as notified
                })) || []
              }))
            };
          }
          return company;
        });
        
        setCompanyUsers(updatedUsers);
      }
    }
  }, [currUser, addNotification, companyUsers, setCompanyUsers]);

  if (!currUser) {
    return <div>Please log in to view your company dashboard.</div>;
  }

  return (
    <div className="company-dashboard">
      <h1>Company Dashboard</h1>
      
      <div className="company-info">
        <h2>{currUser.name}</h2>
        <p><strong>Industry:</strong> {currUser.industry}</p>
        <p><strong>Size:</strong> {currUser.Size}</p>
        <p><strong>Email:</strong> {currUser.email}</p>
      </div>
      
      <div className="dashboard-actions">
        <button 
          className={`notification-toggle ${notificationCount > 0 ? 'has-notifications' : ''}`}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          {showNotifications ? "Hide Notifications" : `View Notifications ${notificationCount > 0 ? `(${notificationCount})` : ''}`}
        </button>
      </div>
      
      {showNotifications && (
        <div className="notification-panel">
          <h3>Notifications</h3>
          {/* Always show an acceptance notification in the panel */}
          <div className="notification-item accepted">
            <p><strong>System Notification</strong> - Your company application has been accepted!</p>
          </div>
          
          {currUser.internships.some(internship => 
            internship.applications && internship.applications.length > 0) ? (
            <ul className="notification-list">
              {currUser.internships.flatMap(internship => 
                (internship.applications || []).map((application, index) => (
                  <li 
                    key={index} 
                    className={`notification-item ${application.status} ${!application.statusNotified ? 'unread' : ''}`}
                  >
                    <p>
                      <strong>{application.firstName} {application.lastName}</strong> - 
                      {application.status === "accepted" && " Application accepted"}
                      {application.status === "rejected" && " Application rejected"}
                      {application.status === "pending" && " Application pending"}
                      {application.status === "finalized" && " Application finalized"}
                    </p>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p>No application notifications yet.</p>
          )}
        </div>
      )}
      
      <h2>Your Internship Postings</h2>
      <div className="internship-listings">
        {currUser.internships && currUser.internships.length > 0 ? (
          currUser.internships.map((internship, index) => (
            <InternshipList key={index} internship={internship} />
          ))
        ) : (
          <p>No internships available.</p>
        )}
      </div>
      
      <div className="navigation-links">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <Link to="/myInterns" className="my-interns-link">
          View My Interns
        </Link>
      </div>
    </div>
  );
}

export default CompanyViewPostings;
