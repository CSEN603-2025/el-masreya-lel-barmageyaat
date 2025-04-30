import { useNavigate, useParams } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function InternshipDetails({ allInternships }) {
  const navigate = useNavigate();
  const id = useParams();
  const internship = allInternships.find(
    (internship) => internship.id === parseInt(id.id)
  );

  function handleApply() {
    navigate(`/internshipApplicationPage/${internship.id}`);
  }

  return (
    <div className="internship-details">
      <StudentsNavBar />
      <h1>{internship.title}</h1>
      <p>Company: {internship.companyName}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Requirements:</p>
      <ul>
        {internship.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
      <p>Compensation: {internship.paid ? "paid" : "unpaid"}</p>
      {internship.paid && <p>Salary: {internship.salary}</p>}
      <p>Duration: {internship.duration}</p>
      <p>Status: {internship.status}</p>
      <button onClick={handleApply}>Apply Now</button>
      <button type="button" onClick={() => window.history.back()}>
        Back
      </button>
      <h2>Applications:</h2>
      {internship.applications.length > 0 ? (
        internship.applications.length
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
}

export default InternshipDetails;
