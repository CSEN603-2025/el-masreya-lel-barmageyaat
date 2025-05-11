import { Link } from "react-router-dom";

export default function CompanyRequestList({ requests, onAccept, onReject }) {
  return (
    <Link to={`/ViewCompanyRequestDetails/${requests.companyName}`}>
      <h2>{requests.companyName}</h2>
      <p>Industry: {requests.industry}</p>
      <p>Company Size: {requests.companySize}</p>
      <p>Email: {requests.email}</p>
      <p>status: {requests.status}</p>
      ________________________________________________________________
    </Link>
  );
}
