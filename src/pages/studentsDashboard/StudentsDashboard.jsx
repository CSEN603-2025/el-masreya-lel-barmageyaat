import { Link } from "react-router-dom";

function StudentsDashboard() {
  return (
    <div>
      <h1>Students Dashboard</h1>
      <Link to="/">Home</Link>
      <br />
      <Link to="/studentProfile">Student Profile</Link>
    </div>
  );
}

export default StudentsDashboard;
