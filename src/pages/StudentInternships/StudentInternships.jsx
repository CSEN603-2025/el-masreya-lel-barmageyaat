import React from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function StudentInternships({ companyUsers, studentUsers }) {
  const { studentId } = useParams();
  const [filterStatus, setFilterStatus] = useState(""); // Keeps track of the selected filter (status)
  const [searchText, setSearchText] = useState(""); // Tracks search input
  const navigate = useNavigate();
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
          <option value="">Show All Internships</option>
          <option value="currentIntern">Current Intern</option>
          <option value="didntStartYet">Didn’t Start Yet</option>
          <option value="InternshipComplete">Internship Complete</option>
        </select>
      </label>

      {/* Search input for company name or job title */}
      <label style={{ marginLeft: "1rem" }}>
        Search:{" "}
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Company or Title"
        />
      </label>

      {internships.length > 0 ? (
        internships
          .filter((internship) => {
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

            // Apply status filter
            if (
              filterStatus &&
              theApplication?.internshipStatus !== filterStatus
            )
              return false;

            // Apply text search filter (company name or title)
            const searchLower = searchText.toLowerCase();
            const companyName = company?.name?.toLowerCase() || "";
            const internshipTitle =
              theCompanyInternship?.title?.toLowerCase() || "";

            return (
              companyName.includes(searchLower) ||
              internshipTitle.includes(searchLower)
            );
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

            ////////////////////////////HERE I SWITCHED REPORT AND EVAL ITS OKAY ITS JUST A MISTAKE ///////////////

            function onGoToEvaluation() {
              navigate(
                `/StudentReportSubmission/${studentId}/${internship.internshipId}/${internship.companyUsername}`
              );
            }
            function onGoToReport() {
              navigate(
                `/StudentEvaluationSubmission/${studentId}/${internship.internshipId}/${internship.companyUsername}`
              );
            }
            return theApplication.internshipStatus !== "InternshipComplete" ? (
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
            ) : (
              <div key={index}>
                <Link
                  to={`/StudentReportSubmission/${studentId}/${internship.internshipId}/${internship.companyUsername}`}
                >
                  <h2>{company?.name}</h2>
                  <h3>{theCompanyInternship.title}</h3>
                  <b>the internship status is: </b>
                  <p>{theApplication.internshipStatus}</p>
                  <b>the start date is: </b>
                  <p>{theCompanyInternship.startDate}</p>
                  <b>the duration is: </b>
                  <p>{theCompanyInternship.duration}</p>
                </Link>
                <button onClick={onGoToEvaluation}>
                  Go to Evaluation Submission
                </button>
                <button onClick={onGoToReport}>Go to Report Submission</button>
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
