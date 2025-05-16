import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./StudentInternships.css";

function StudentInternships({ companyUsers, studentUsers }) {
  const { studentId } = useParams();
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const student = studentUsers.find(
    (student) => String(student.studentId) === String(studentId)
  );

  const internships = student?.appliedInternships || [];

  return (
    <div className="internships-container">
      <h1 className="internships-header">{student?.firstName}'s Internships</h1>

      <div className="internships-filters">
        <label>
          <span>Filter by Status:</span>
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

        <label>
          <span>Search:</span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Company or Title"
          />
        </label>
      </div>

      <div className="internships-list">
        {internships.length > 0 ? (
          internships
            .filter((internship) => {
              const company = companyUsers.find(
                (company) => company.username === internship.companyUsername
              );
              const theCompanyInternship = company?.internships?.find(
                (i) => i.internshipID === internship.internshipId
              );
              const theApplication = theCompanyInternship?.applications?.find(
                (app) => Number(app.studentId) === Number(studentId)
              );

              if (
                filterStatus &&
                theApplication?.internshipStatus !== filterStatus
              )
                return false;

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
                (i) => i.internshipID === internship.internshipId
              );
              const theApplication = theCompanyInternship?.applications?.find(
                (app) => Number(app.studentId) === Number(studentId)
              );

              const onGoToEvaluation = () => {
                navigate(
                  `/StudentReportSubmission/${studentId}/${internship.internshipId}/${internship.companyUsername}`
                );
              };

              const onGoToReport = () => {
                navigate(
                  `/StudentEvaluationSubmission/${studentId}/${internship.internshipId}/${internship.companyUsername}`
                );
              };

              return (
                <div className="internship-card" key={index}>
                  <Link
                    to={`/StudentReportSubmission/${studentId}/${internship.internshipId}/${internship.companyUsername}`}
                    className="internship-link"
                  >
                    <h2>{company?.name}</h2>
                    <h3>{theCompanyInternship?.title}</h3>
                    <p>
                      <b>Status:</b> {theApplication?.internshipStatus}
                    </p>
                    <p>
                      <b>Start Date:</b> {theCompanyInternship?.startDate}
                    </p>
                    <p>
                      <b>Duration:</b> {theCompanyInternship?.duration}
                    </p>
                  </Link>
                  {theApplication.internshipStatus === "InternshipComplete" && (
                    <div className="internship-buttons">
                      <button onClick={onGoToEvaluation}>
                        Evaluation Submission
                      </button>
                      <button onClick={onGoToReport}>Report Submission</button>
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <p className="no-internships">No internships found.</p>
        )}
      </div>
    </div>
  );
}

export default StudentInternships;
