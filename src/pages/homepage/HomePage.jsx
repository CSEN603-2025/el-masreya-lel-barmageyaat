import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function HomePage() {
  return (
    <div>
      <StudentsNavBar />
      <h1>Home Page</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/CompanyRegister">Company Register</Link>
      <br />
      <Link to="/studentsDashboard">Go to Students Dashboard</Link>
      <br />
      <Link to="/Workshops">Workshops</Link>
      <br />
      <Link to="/StudentWorkshops">StudentWorkshops</Link>

    </div>
  );
}

export default HomePage;
