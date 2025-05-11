import { useState } from "react";
import { useParams } from "react-router-dom";

function StudentInternships({ companyUsers, studentUsers }) {
  const { studentId } = useParams();
  const [filterStatus, setFilterStatus] = useState(""); // Keeps track of the selected filter (status)

  const student = studentUsers.find(
    (student) => String(student.studentId) === String(studentId)
  );

  const internships = student?.appliedInternships || [];

  return (
    <div>
      <h1>{student.firstName}'s Internships</h1>

      {/* Dropdown to filter by internship status */}
      <label>
        Filter by Status:{" "}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="currentIntern">Current Intern</option>
          <option value="didntStartYet">Didn’t Start Yet</option>
          <option value="InternshipComplete">Internship Complete</option>
        </select>
      </label>

      {internships.length > 0 ? (
        internships
          .filter((internship) => {
            if (!filterStatus) return true; // no filter applied
            const company = companyUsers.find(
              (company) => company.username === internship.companyUsername
            );
            const theCompanyInternship = company?.internships?.find(
              (aCompanyInternship) =>
                aCompanyInternship.internshipID === internship.internshipId
            );
            const theApplication = theCompanyInternship?.applications?.find(
              (application) =>
                Number(application.studentId) === Number(studentId)
            );
            return theApplication?.internshipStatus === filterStatus;
          })
          .map((internship, index) => {
            const company = companyUsers.find(
              (company) => company.username === internship.companyUsername
            );

            const theCompanyInternship = company?.internships?.find(
              (aCompanyInternship) =>
                aCompanyInternship.internshipID === internship.internshipId
            );

            const theApplication = theCompanyInternship?.applications?.find(
              (application) =>
                Number(application.studentId) === Number(studentId)
            );

            return (
              <div key={index}>
                <h2>{company?.name}</h2>
                <h3>{theCompanyInternship.title}</h3>
                <b>the internship status is: </b>
                <p>{theApplication.internshipStatus}</p>
                <b>the start date is: </b>
                <p>{theCompanyInternship.startDate}</p>
                <b>the duration is: </b>
                <p>{theCompanyInternship.duration}</p>
              </div>
            );
          })
      ) : (
        <p>No internships found.</p>
      )}
    </div>
  );
}

export default StudentInternships;
