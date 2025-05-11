import { useState } from "react";
import { useParams } from "react-router-dom";

function StudentInternships({ companyUsers, studentUsers }) {
  const { studentId } = useParams();
  const [filterStatus, setFilterStatus] = useState(""); // Keeps track of the selected filter (status)

  const student = studentUsers.find(
    (student) => String(student.studentId) === String(studentId)
  );

  const internships = student?.appliedInternships || [];

  // Function to filter internships based on status
  const handleStatusChange = (e) => {
    setFilterStatus(e.target.checked ? "currentIntern" : ""); // Set the filter status based on the checkbox
  };

  return (
    <div>
      <h1>{student.firstName}'s Internships</h1>

      {/* Checkbox to filter by current interns */}
      <label>
        Show current Intern
        <input type="checkbox" onChange={handleStatusChange} />
      </label>

      {internships.length > 0 ? (
        internships.map((internship, index) => {
          // Find the corresponding company for this internship
          const company = companyUsers.find(
            (company) => company.username === internship.companyUsername
          );
          // console.log("company is : " + JSON.stringify(company, null, 2));

          // Find the application inside the internship where the student is involved
          const theCompanyInternship = company.internships?.find(
            (aCompanyInternship) =>
              aCompanyInternship.internshipID === internship.internshipId
          );
          console.log(
            "theCompanyInternship is : " +
              JSON.stringify(theCompanyInternship, null, 2)
          );
          console.log(studentId);
          const theApplication = theCompanyInternship.applications?.find(
            (application) => Number(application.studentId) === Number(studentId)
          );
          console.log(
            "the application is : " + JSON.stringify(theApplication, null, 2)
          );
          return (
            <div key={index}>
              <h2>{company?.name}</h2>
              <h3>{theCompanyInternship.title}</h3>
              <b>the interenship status is : </b>
              <p>{theApplication.internshipStatus}</p>
              <b>the start date is : </b>
              <p>{theCompanyInternship.startDate}</p>
              <b>the duration is : </b>
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
