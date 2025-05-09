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

  //  this filters based on the all Internship array NOT THE COMPANY USERS INTERNSHIP ATTRIBUTE ARRAY

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
    <div>
      <StudentsNavBar />
      <h1>Students Dashboard</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by company name"
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
      />
      {/* this filters based on the company users internship attribute array */}
      {filteredInternships.map((internship) => (
        <InternshipList
          internship={internship}
          key={internship.companyName + internship.title}
        />
      ))}

      <Link to="/">Home</Link>
      <br />
      <Link to="/studentProfile">Student Profile</Link>
    </div>
  );
}

export default StudentsDashboard;
