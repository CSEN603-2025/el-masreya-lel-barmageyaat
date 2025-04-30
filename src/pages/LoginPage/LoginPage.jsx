import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function LoginPage({ setCurrUser, studentUser, scadUser, companyUser }) {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log(user, password);
    console.log(studentUser);

    // -----------------------------------------searches for the user in the array of objects ------------------------------------------

    const foundStudentUser = studentUser.find(
      (student) => student.username === user && student.password === password
    );
    const foundScadUser = scadUser.find(
      (scad) => scad.username === user && scad.password === password
    );
    const foundCompanyUser = companyUser.find(
      (company) => company.username === user && company.password === password
    );

    // -------------------------------------------------------- if found do this  -------------------------------------------------------

    if (foundStudentUser) {
      setMessage("Login successful! Redirecting to Student Dashboard...");
      navigate("/studentsDashboard");
      setCurrUser(foundStudentUser);
    } else if (foundScadUser) {
      setMessage("Login successful! Redirecting to SCAD Dashboard...");
      navigate("/studentsDashboard");
      setCurrUser(foundScadUser);
    } else if (foundCompanyUser) {
      setMessage("Login successful! Redirecting to Company Dashboard...");
      navigate(`/companyViewPostings/${foundCompanyUser.username}`);
      setCurrUser(foundCompanyUser);
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  }

  return (
    <div>
      <StudentsNavBar />
      <h1>Login Page</h1>
      <form onSubmit={(e) => handleLogin(e)}>
        <div>
          <label>User:</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* here is outputted both because they cant happen at the same time 
      note to self: add styling for this part in the css file */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <Link to="/">Home</Link>
      <br />
      <Link to="/companyRegister">Company Register</Link>
    </div>
  );
}

export default LoginPage;
