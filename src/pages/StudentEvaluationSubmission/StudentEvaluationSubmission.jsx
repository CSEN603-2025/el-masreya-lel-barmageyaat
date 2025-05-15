import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function StudentReportSubmission({ studentUsers, setStudentUsers }) {
  const { studentId, internshipId, companyUsername } = useParams();
  const navigate = useNavigate();

  // Use studentId to find the student
  const student = studentUsers.find(
    (student) => student.studentId === parseInt(studentId)
  );

  // Use internshipId and companyUsername to find the corresponding applied internship
  const appliedInternship = student?.appliedInternships.find(
    (internship) =>
      internship.internshipId === parseInt(internshipId) &&
      internship.companyUsername === companyUsername
  );

  console.log(appliedInternship);

  // State to handle the report submission
  const [report, setReport] = useState("");
  // Handle form submission
  const handleReportSubmit = (e) => {
    e.preventDefault();

    if (appliedInternship) {
      // Prepare the report data as an object
      const updatedAppliedInternship = {
        ...appliedInternship,
        report: {
          introduction: report.introduction,
          body: report.body,
          conclusion: report.conclusion,
          date: new Date().toISOString(),
          status: "pending",
        },
      };

      // Update the student's appliedInternships with the report data
      setStudentUsers((prevStudents) =>
        prevStudents.map((stu) =>
          stu.studentId === student.studentId
            ? {
                ...stu,
                appliedInternships: stu.appliedInternships.map((internship) =>
                  internship.internshipId === appliedInternship.internshipId &&
                  internship.companyUsername ===
                    appliedInternship.companyUsername
                    ? updatedAppliedInternship
                    : internship
                ),
              }
            : stu
        )
      );

      // Redirect the student to a confirmation or back to the previous page
      alert("Report submitted successfully!");
      navigate(-1); // Go back to the previous page
    } else {
      alert("No matching internship found.");
    }
  };

  return (
    <div>
      <h1>Student Report Submission for {companyUsername}</h1>

      {appliedInternship ? (
        <form onSubmit={handleReportSubmit}>
          {/* Introduction Part */}
          <div>
            <h2>Introduction</h2>
            <textarea
              id="introduction"
              name="introduction"
              rows="5"
              cols="50"
              value={report.introduction}
              onChange={(e) =>
                setReport({ ...report, introduction: e.target.value })
              }
              required
            ></textarea>
          </div>

          {/* Body Part */}
          <div>
            <h2>Body</h2>
            <textarea
              id="body"
              name="body"
              rows="5"
              cols="50"
              value={report.body}
              onChange={(e) => setReport({ ...report, body: e.target.value })}
              required
            ></textarea>
          </div>

          {/* Conclusion Part */}
          <div>
            <h2>Conclusion</h2>
            <textarea
              id="conclusion"
              name="conclusion"
              rows="5"
              cols="50"
              value={report.conclusion}
              onChange={(e) =>
                setReport({ ...report, conclusion: e.target.value })
              }
              required
            ></textarea>
          </div>

          <button type="submit">Submit Report</button>
        </form>
      ) : (
        <p>No matching internship found for this student.</p>
      )}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default StudentReportSubmission;
