import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function StudentsDashboard() {
  return (
    <div>
      <StudentsNavBar />
      <h1>Students Dashboard</h1>
      <Link to="/">Home</Link>
      <br />
      <Link to="/studentProfile">Student Profile</Link>
    </div>
  );
}

export default StudentsDashboard;
