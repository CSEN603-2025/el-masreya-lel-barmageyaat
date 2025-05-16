import React from "react";
import "./CompanyRequestList.css";

function CompanyRequestList({ requests, onAccept, onReject }) {
  return (
    <div className="request-card">
      <div className="company-name">{requests.companyName}</div>
      <div className="company-info">
        <div><strong>Industry:</strong> {requests.industry}</div>
        <div><strong>Location:</strong> {requests.location}</div>
        <div><strong>Email:</strong> {requests.email}</div>
        <div><strong>Phone:</strong> {requests.phone}</div>
        {requests.website && <div><strong>Website:</strong> {requests.website}</div>}
      </div>
      <div className="request-actions">
        <button className="accept-button" onClick={onAccept}>
          Accept
        </button>
        <button className="reject-button" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
}

export default CompanyRequestList;
