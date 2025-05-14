import React from 'react';
import Notification from '../Notification/Notification';
import './NotificationList.css';

function NotificationList({ notifications, onDismiss }) {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-list">
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          message={notification.message}
          type={notification.type}
          onDismiss={() => onDismiss(index)}
        />
      ))}
    </div>
  );
}

export default NotificationList; 