import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CompanyNotifications.css';

function CompanyNotifications({ notifications, onMarkAsRead, onClearAll }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!notifications || notifications.length === 0) {
    return (
      <div className="company-notifications">
        <button 
          className="notification-toggle empty"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className="notification-icon">🔔</i>
          <span className="notification-count">0</span>
        </button>
        
        {isOpen && (
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Notifications</h3>
            </div>
            <div className="empty-notifications">
              <p>No new notifications</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return (
    <div className="company-notifications">
      <button 
        className={`notification-toggle ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="notification-icon">🔔</i>
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>
      
      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className="clear-all-btn"
                onClick={onClearAll}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {sortedNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-date">{new Date(notification.date).toLocaleDateString()}</p>
                </div>
                
                {notification.type === 'application' && notification.studentId && notification.internshipId && (
                  <Link 
                    to={`/ApplicantDetails/${notification.studentId}`} 
                    className="view-details-btn"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    View Details
                  </Link>
                )}
                
                {!notification.read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyNotifications; 