import React from "react";
import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import InternshipList from "../../components/InternshipList/InternshipList";
import { useEffect, useMemo, useState } from "react";

function StudentsDashboard({ companyUsers }) {
  const allInternships = useMemo(() => {
    return companyUsers.flatMap((company) => company.internships);
  }, [companyUsers]);
  const [filteredInternships, setFilteredInternships] =
    useState(allInternships);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  useEffect(() => {
    const filtered = allInternships.filter((internship) => {
      return (
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredInternships(filtered);
  }, [filterTerm, searchTerm, allInternships]);

  return (
    <div className="studentsDashboardContainer">
      <StudentsNavBar />

      <div className="searchFilterContainer">
        <input
          type="text"
          className="searchInput"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          className="filterInput"
          placeholder="Filter by company name"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
      </div>

      <div className="internshipListContainer">
        {filteredInternships.map((internship) => (
          <InternshipList
            internship={internship}
            key={internship.companyName + internship.title}
          />
        ))}
      </div>

      <div className="linksContainer">
        <Link to="/" className="linkButton">
          Home
        </Link>
        <br />
        <Link to="/studentProfile" className="linkButton">
          Student Profile
        </Link>
      </div>
    </div>
  );
}

export default StudentsDashboard;
