import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentsNavBar.css";

function StudentsNavBar({
  currUser,
  notifications = [],
  onMarkAsRead,
  onClearAll,
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <nav className="student-navbar">
      <div className="nav-brand">
        <Link to="/studentsDashboard">SCAD Internship Portal</Link>
      </div>

      <div className="nav-actions">
        <div className="notifications-wrapper">
          <button
            className="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="notification-icon">🔔</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                {notifications?.length > 0 && (
                  <button
                    className="clear-all-button"
                    onClick={() => {
                      onClearAll?.();
                      setShowNotifications(false);
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {!notifications?.length ? (
                  <p className="no-notifications">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                      onClick={() => {
                        onMarkAsRead?.(notification.id);
                        setShowNotifications(false);
                      }}
                    >
                      <p>{notification.message}</p>
                      <span className="notification-date">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-menu">
          <Link to="/StudentProfile" className="profile-link">
            <span className="user-name">{currUser?.firstName || "User"}</span>
            <span className="user-avatar">👤</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default StudentsNavBar;
