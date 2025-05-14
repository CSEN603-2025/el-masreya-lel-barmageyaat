import React from 'react';
import './Notification.css';

function Notification({ message, type, onDismiss }) {
  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <span>{message}</span>
        {onDismiss && (
          <button className="dismiss-btn" onClick={onDismiss}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default Notification; 