import { useEffect, useState } from "react";
import CompanyRequestList from "../../components/CompanyRequestList/CompanyRequestList";
import { Link } from "react-router-dom";
import "./ViewCompanyRequest.css";

function ViewCompanyRequest({ companyRequests, setCompanyRequests }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredRequests, setFilteredRequests] = useState(companyRequests);

  useEffect(() => {
    const filtered = companyRequests.filter(
      (request) =>
        (request.companyName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (request.industry || "").toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [search, companyRequests, filter]);

  const onAccept = () => {
    console.log("Accepted");
  };

  const onReject = () => {
    console.log("Rejected");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>SCAD Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="/ScadDashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/">Company</Link>
            </li>
            <li>
              <Link to="/AllStudents">Students</Link>
            </li>
            <li>
              <Link to="/">Job Posts</Link>
            </li>
            <li>
              <Link to="/ViewCompanyRequest">Company Requests</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <h1>View Company Requests</h1>

        <div className="filters">
          <input
            className="input-field"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Filter by industry..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="requests-list">
          {filteredRequests.map((request) => (
            <CompanyRequestList
              key={request.companyName}
              requests={request}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default ViewCompanyRequest;
