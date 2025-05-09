import { useNavigate, useParams } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import Applicant from "../../components/Applicant/Applicant";
import "./InternshipDetails.css";

function InternshipDetails({ companyUsers }) {
  const navigate = useNavigate();
  const { id, companyName } = useParams();

  const company = companyUsers.find((c) => c.username === companyName);
  if (!company) return <p>Company not found.</p>;

  const internship = company.internships.find(
    (i) => i.internshipID === parseInt(id)
  );
  if (!internship) return <p>Internship not found.</p>;

  function handleApply() {
    navigate(
      `/internshipApplicationPage/${internship.internshipID}/${companyName}`
    );
  }

  return (
    <div>
      <StudentsNavBar />
      <div className="internship-details-container">
        <div className="internship-header">
          <h1>{internship.title}</h1>
          <p className="company-name">{internship.companyName}</p>
        </div>

        <div className="internship-info">
          <p>
            <strong>Location:</strong> {internship.location}
          </p>
          <p>
            <strong>Description:</strong> {internship.description}
          </p>
          <div>
            <strong>Requirements:</strong>
            <ul>
              {internship.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <p>
            <strong>Compensation:</strong> {internship.paid ? "Paid" : "Unpaid"}
          </p>
          {internship.paid && (
            <p>
              <strong>Salary:</strong> {internship.salary}
            </p>
          )}
          <p>
            <strong>Duration:</strong> {internship.duration}
          </p>
          <p>
            <strong>Status:</strong> {internship.status}
          </p>
        </div>

        <div className="internship-buttons">
          <button onClick={handleApply}>Apply Now</button>
          <button onClick={() => window.history.back()}>Back</button>
        </div>

        <div className="applications-section">
          <h2>Applications</h2>
          {internship.applications.length > 0 ? (
            internship.applications.map((applicant, index) => (
              <div key={index} className="applicant-card">
                <h3>Applicant {index + 1}</h3>
                <Applicant applicant={applicant} />
              </div>
            ))
          ) : (
            <p>No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;
