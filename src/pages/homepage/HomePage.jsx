import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/studentsDashboard">Go to Students Dashboard</Link>
    </div>
  );
}

export default HomePage;
