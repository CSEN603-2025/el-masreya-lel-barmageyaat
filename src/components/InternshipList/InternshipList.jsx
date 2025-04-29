import { Link } from "react-router-dom";

function InternshipList({ internship }) {
  return (
    <Link
      to={`/internship/${internship.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="internship-card"
        style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
      >
        <h2>{internship.title}</h2>
        <p>Company: {internship.companyName}</p>
        <p>Location: {internship.location}</p>
        <p>Description: {internship.description}</p>
        <p>Requirements:</p>
        <ul>
          {internship.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
        <p>Duration: {internship.duration}</p>
        <p>Status: {internship.status}</p>
      </div>
    </Link>
  );
}

export default InternshipList;
