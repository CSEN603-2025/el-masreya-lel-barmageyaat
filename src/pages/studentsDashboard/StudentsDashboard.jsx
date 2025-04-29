import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import InternshipList from "../../components/InternshipList/InternshipList";

function StudentsDashboard({ allInternships, setAllInternships }) {
  return (
    <div>
      <StudentsNavBar />
      <h1>Students Dashboard</h1>
      {allInternships.map((internship) => {
        return <InternshipList internship={internship} key={internship.id} />;
      })}
      <Link to="/">Home</Link>
      <br />
      <Link to="/studentProfile">Student Profile</Link>
    </div>
  );
}

export default StudentsDashboard;
