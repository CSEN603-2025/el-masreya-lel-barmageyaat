import { useNavigate, useParams } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import Applicant from "../../components/Applicant/Applicant";

function InternshipDetails({ allInternships, companyUsers }) {
  const navigate = useNavigate();
  const { id, companyName } = useParams();
  console.log("Internship ID:", id);
  console.log("Company Name:", companyName);

  const company = companyUsers.find((c) => c.username === companyName);
  if (!company) return <p>Company not found.</p>;

  const internship = company.internships.find((i) => i.id === parseInt(id));
  if (!internship) return <p>Internship not found.</p>;

  function handleApply() {
    navigate(`/internshipApplicationPage/${internship.id}/${companyName}`);
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
        internship.applications.length ? (
          internship.applications.map((applicant, index) => (
            <div key={index}>
              <h3>Applicant {index + 1}</h3>
              <Applicant applicant={applicant} />
            </div>
          ))
        ) : null
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
}

export default InternshipDetails;
