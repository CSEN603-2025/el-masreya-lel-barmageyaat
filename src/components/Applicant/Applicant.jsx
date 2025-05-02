import { Navigate, useNavigate } from "react-router-dom";

function Applicant({ applicant }) {
  const navigate = useNavigate();
  return (
    <div>
      {console.log("Applicant:", applicant.user.username)}
      <p>Name: {applicant.user.username}</p>
      <p>Resume: {applicant.user.email}</p>
      <p>Cover Letter: {applicant.coverLetter}</p>
      <button
        onClick={() => navigate(`/ApplicantDetails/${applicant.user.username}`)}
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
