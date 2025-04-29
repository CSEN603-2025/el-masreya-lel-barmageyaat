import { useParams } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function InternshipDetails({ allInternships }) {
  const id = useParams();
  const internship = allInternships.find(
    (internship) => internship.id === parseInt(id.id)
  );

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
      <button>Apply Now</button>
    </div>
  );
}

export default InternshipDetails;
