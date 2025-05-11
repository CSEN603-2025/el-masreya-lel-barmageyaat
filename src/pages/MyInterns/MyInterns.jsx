import { useState } from "react";

function MyInterns({ companyUsers, currUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCurrent, setShowCurrent] = useState(true);
  const [showPast, setShowPast] = useState(false);

  const currCompany = companyUsers.find(
    (company) => company.companyId === currUser.companyId
  );

  if (!currCompany || !currCompany.internships) {
    return <p>No company or internships found.</p>;
  }

  // Flatten all applicants with internship title
  const allApplicants = currCompany.internships.flatMap(
    (internship) =>
      internship.applications?.map((applicant) => ({
        ...applicant,
        internshipTitle: internship.title,
      })) || []
  );

  // Apply filters
  const filteredInterns = allApplicants.filter((intern) => {
    const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
    const internshipTitle = intern.internshipTitle.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      internshipTitle.includes(searchTerm.toLowerCase());

    const isCurrent = intern.internshipStatus === "currentIntern";
    const isPast = intern.internshipStatus === "InternshipComplete";

    const matchesStatus = (showCurrent && isCurrent) || (showPast && isPast);

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h1>My Interns</h1>

      <input
        type="text"
        placeholder="Search by intern name or internship title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "10px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={showCurrent}
            onChange={() => setShowCurrent(!showCurrent)}
          />{" "}
          Current Interns
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            checked={showPast}
            onChange={() => setShowPast(!showPast)}
          />{" "}
          Past Interns
        </label>
      </div>

      {filteredInterns.length > 0 ? (
        filteredInterns.map((intern) => (
          <div
            key={intern.username}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h2>{intern.firstName + " " + intern.lastName}</h2>
            <p>Internship Status: {intern.internshipStatus}</p>
            <p>Internship Title: {intern.internshipTitle}</p>
          </div>
        ))
      ) : (
        <p>No matching interns found.</p>
      )}
    </div>
  );
}

export default MyInterns;
