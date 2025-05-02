import { useParams } from "react-router-dom";

function ApplicantDetails({ companyUsers }) {
  const { username } = useParams();

  const applicant = companyUsers.map((company) =>
    company.internships.map((internship) => {
      return internship.applications.find(
        (application) => application.user.username === username
      );
    })
  );

  return (
    <div>
      <h1>this is the applicant</h1>
      {applicant.length > 0 ? (
        <div>
          <p>Applicant data found. Check the console for details.</p>
          {console.log("Applicant:", applicant)}
        </div>
      ) : (
        <p>No applications found for this user.</p>
      )}
    </div>
  );
}

export default ApplicantDetails;
