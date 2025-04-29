import { useEffect } from "react";
import CompanyRequestList from "../../components/CompanyRequestList/CompanyRequestList";
function ViewCompanyRequest({ companyRequests }) {
  return (
    <div>
      <h1>View Company Request</h1>
      {companyRequests.map((request) => (
        <CompanyRequestList
          key={request.companyName}
          requests={request}
          onAccept={() => console.log("Accepted")}
          onReject={() => console.log("Rejected")}
        />
      ))}
    </div>
  );
}

export default ViewCompanyRequest;
