import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ApplicantDetails({
  companyUsers,
  studentUsers,
  setCompanyUsers,
  setStudentUsers,
}) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);

  const companyApplicant = companyUsers.flatMap((company) =>
    company.internships.flatMap((internship) =>
      internship.applications.filter(
        (application) => application.username === username
      )
    )
  )[0]; // the [0] is to get the first match

  const studentApplications = {};

  return (
    <div>
      {companyApplicant ? (
        <div>
          {console.log(companyApplicant)}
          <b>name:</b> {companyApplicant.firstName} {companyApplicant.lastName}
          <br />
          <b>cover letter:</b> {companyApplicant.coverLetter}
          <br />
          <b>email:</b> {companyApplicant.email}
          <br />
          <b>skills:</b>
          <ul>
            {companyApplicant.skills.map((skill) => (
              <li>{skill}</li>
            ))}
          </ul>
          <br />
          experiences: <h4>this is a placeholder for the experiences</h4>
        </div>
      ) : (
        <h1>No applicants found with that name (this is a code issue)</h1>
      )}
    </div>
  );
}

export default ApplicantDetails;
