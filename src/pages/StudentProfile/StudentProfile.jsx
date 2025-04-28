import { Link } from "react-router-dom";

function StudentProfile() {
  return (
    <div>
      <h1>Student Profile</h1>
      <Link to="/studentsDashboard">Go to Students Dashboard</Link>
    </div>
  );
}

export default StudentProfile;
