import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentNotifications.css';

function StudentNotifications({ notifications = [], onMarkAsRead, onClearAll }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Count unread notifications
  const unreadCount = notifications ? notifications.filter(notification => !notification.read).length : 0;
  
  // Sort notifications by date (newest first)
  const sortedNotifications = notifications 
    ? [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];
  
  return (
    <div className="student-notifications">
      <button 
        className={`notification-toggle ${unreadCount > 0 ? 'has-unread' : ''} ${!notifications || notifications.length === 0 ? 'empty' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
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
            {notifications && notifications.length > 0 && (
              <button 
                className="clear-all-btn"
                onClick={onClearAll}
              >
                Clear All
              </button>
            )}
          </div>
          
          {!notifications || notifications.length === 0 ? (
            <div className="empty-notifications">
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="notifications-list">
              {sortedNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.category || ''}`}
                >
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-date">{new Date(notification.date).toLocaleDateString()}</p>
                  </div>
                  
                  {notification.category === 'internship_cycle' && (
                    <Link 
                      to="/studentsDashboard" 
                      className="view-details-btn"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      View Internships
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
          )}
        </div>
      )}
    </div>
  );
}

export default StudentNotifications; 