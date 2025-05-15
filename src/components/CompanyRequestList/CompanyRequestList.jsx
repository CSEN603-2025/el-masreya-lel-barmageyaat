import React from "react";
import { Link } from "react-router-dom";
import "./CompanyRequestList.css";

export default function CompanyRequestList({ requests }) {
  return (
    <Link
      to={`/ViewCompanyRequestDetails/${requests.companyName}`}
      className="request-row"
    >
      <div className="company-name">{requests.companyName}</div>
      <div className="industry">{requests.industry}</div>
      <div className={`status ${requests.status.toLowerCase()}`}>
        {requests.status}
      </div>
    </Link>
  );
}
