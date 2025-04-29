export default function CompanyRequestList({ requests, onAccept, onReject }) {
  return (
    <div>
      <h2>{requests.companyName}</h2>
      <p>Industry: {requests.industry}</p>
      <p>Company Size: {requests.companySize}</p>
      <p>Email: {requests.email}</p>
      <button onClick={onAccept}>Accept</button>
      <button onClick={onReject}>Reject</button>
    </div>
  );
}
