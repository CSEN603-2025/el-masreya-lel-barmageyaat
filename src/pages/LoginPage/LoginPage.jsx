import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function LoginPage({ setUserType }) {
  const navigate = useNavigate();

  const studentUser = "wello";
  const studentPassword = "1234";

  const scadUser = "scad";
  const scadPassword = "1234";

  const companyUser = "company";
  const companyPassword = "1234";

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (user === studentUser && password === studentPassword) {
      setSuccess(true);
      setMessage("Login successful! Redirecting to Student Dashboard...");
      navigate("/studentsDashboard");
      setUserType("student");
    } else if (user === scadUser && password === scadPassword) {
      setSuccess(true);
      setMessage("Login successful! Redirecting to SCAD Dashboard...");
      navigate("/studentsDashboard");

      setUserType("scad");
    } else if (user === companyUser && password === companyPassword) {
      setSuccess(true);
      setMessage("Login successful! Redirecting to Company Dashboard...");
      navigate("/studentsDashboard");
      setUserType("company");
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
          <label htmlFor="user">User:</label>
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
