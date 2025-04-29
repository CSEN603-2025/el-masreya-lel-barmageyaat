import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function StudentProfile() {
  return (
    <div>
      <StudentsNavBar />
      <h1>Student Profile</h1>
      <Link to="/studentsDashboard">Go to Students Dashboard</Link>
    </div>
  );
}

export default StudentProfile;
