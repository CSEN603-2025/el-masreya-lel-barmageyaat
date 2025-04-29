import { useEffect, useState } from "react";
import CompanyRequestList from "../../components/CompanyRequestList/CompanyRequestList";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
function ViewCompanyRequest({ companyRequests, setCompanyRequests }) {
  const [search, setSearch] = useState("");
  const [filteredRequests, setFilteredRequests] = useState(companyRequests);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const filtered = companyRequests.filter(
      (request) =>
        (request.companyName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (request.industry || "")
          .toLowerCase()
          .includes(filter?.toLowerCase() || "")
    );
    setFilteredRequests(filtered);
  }, [search, companyRequests, filter]);
  function onAccept() {
    console.log("Accepted");
  }
  function onReject() {
    console.log("Rejected");
  }

  return (
    <div>
      <StudentsNavBar />
      <h1>View Company Request</h1>
      <input
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        placeholder="Filter by status..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
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
