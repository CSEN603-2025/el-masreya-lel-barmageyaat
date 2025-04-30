import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function StudentProfile({ currUser, studentUsers }) {
  return (
    <div>
      <StudentsNavBar />
      <h1>Student Profile</h1>
      <h1>{currUser.username}</h1>
      ___________________________________
      <h2>job interests</h2>
      <p>{currUser.interests?.join(", ")}</p>
      ___________________________________
      <h2>Skills</h2>
      <p>{currUser.skills?.join(", ")}</p>
      ___________________________________
      <h2>Experiences</h2>
      <ul>
        {currUser.experiences?.map((experience, index) => (
          <li key={index}>
            <h3>{experience.title}</h3>
            <p>{experience.company}</p>
            <p>{experience.responsibilities}</p>
            <p>{experience.duration}</p>
          </li>
        ))}
      </ul>
      ___________________________________
      <h2>Education</h2>
      <ul>
        {currUser.education?.map((education, index) => (
          <li key={index}>
            <h3>{education.degree}</h3>
            <p>{education.institution}</p>
            <p>{education.year}</p>
          </li>
        ))}
      </ul>
      ___________________________________
      <br />
      <br />
      <Link to="/studentsDashboard">Go to Students Dashboard</Link>
    </div>
  );
}

export default StudentProfile;
