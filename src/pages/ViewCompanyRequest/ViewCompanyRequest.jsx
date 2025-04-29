import { useEffect, useState } from "react";
import CompanyRequestList from "../../components/CompanyRequestList/CompanyRequestList";
function ViewCompanyRequest({ companyRequests, setCompanyRequests }) {
  const [search, setSearch] = useState("");
  const [filteredRequests, setFilteredRequests] = useState(companyRequests);

  useEffect(() => {
    const filtered = companyRequests.filter((request) =>
      (request.companyName || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [search, companyRequests]);
  function onAccept() {
    console.log("Accepted");
  }
  function onReject() {
    console.log("Rejected");
  }

  return (
    <div>
      <h1>View Company Request</h1>
      <input
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredRequests.map((request) => (
        <CompanyRequestList
          key={request.companyName}
          requests={request}
          onAccept={() => onAccept()}
          onReject={() => onReject()}
        />
      ))}
    </div>
  );
}

export default ViewCompanyRequest;
