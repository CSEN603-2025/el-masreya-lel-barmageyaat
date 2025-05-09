import { Navigate, useNavigate } from "react-router-dom";

function Applicant({ applicant }) {
  const navigate = useNavigate();
  return (
    <div>
      {console.log("Applicant:", applicant.username)}
      <p>First Name: {applicant.firstName}</p>
      <p>Lirst Name: {applicant.lastName}</p>
      <p>Resume: {applicant.email}</p>
      <p>Cover Letter: {applicant.coverLetter}</p>
      <button
        onClick={() => navigate(`/ApplicantDetails/${applicant.username}`)}
      >
        View Details
      </button>
      <button type="button" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}

export default Applicant;
