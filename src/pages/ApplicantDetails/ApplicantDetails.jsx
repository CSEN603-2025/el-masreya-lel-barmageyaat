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
        (application) => application.user.username === username
      )
    )
  )[0]; // the [0] is to get the first match

  const studentApplications = {};

  return (
    <div>
      {companyApplicant ? (
        <div>
          name: {companyApplicant.user.username}
          <br />
          cover letter: {companyApplicant.coverLetter}
        </div>
      ) : (
        <h1>No applicants found with that name (this is a code issue)</h1>
      )}
    </div>
  );
}

export default ApplicantDetails;
