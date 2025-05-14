import { Link } from "react-router-dom";
import "./InternshipList.css"; // Make sure this line is added

function InternshipList({ internship }) {
  return (
    <Link
      to={`/internshipDetails/${internship.internshipID}/${internship.companyName}`}
      className="internship-card-link"
    >
      <div className="internship-card">
        <h2 className="internship-title">{internship.title}</h2>
        <p className="internship-company">Company: {internship.companyName}</p>
        <p className="internship-location">Location: {internship.location}</p>
        <p className="internship-status">Status: {internship.status}</p>
        <button className="delte_internship-button">Delete</button>
      </div>
    </Link>
  );
}

export default InternshipList;
