import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentsNavBar.css";
import scadlogo from "/src/assets/scady.png";

function StudentsNavBar({ setCurrUser, studentUser, scadUser, companyUser }) {
  const navigate = useNavigate();
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const scrollToLogin = () => {
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToRegister = () => {
    if (registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const foundStudentUser = studentUser.find(
      (student) => student.username === user && student.password === password
    );
    const foundScadUser = scadUser.find(
      (scad) => scad.username === user && scad.password === password
    );
    const foundCompanyUser = companyUser.find(
      (company) => company.username === user && company.password === password
    );

    if (foundStudentUser) {
      setMessage("Login successful! Redirecting to Student Dashboard...");
      setCurrUser(foundStudentUser);
      navigate("/studentsDashboard");
    } else if (foundScadUser) {
      setMessage("Login successful! Redirecting to SCAD Dashboard...");
      setCurrUser(foundScadUser);
      navigate("/ScadDashboard");
    } else if (foundCompanyUser) {
      setMessage("Login successful! Redirecting to Company Dashboard...");
      setCurrUser(foundCompanyUser);
      navigate("/companyViewPostings/");
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="background-wrapper">
        <div className="background-overlay"></div>
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-main">
              <img
                src={scadlogo}
                alt="SCAD Internships Logo"
                className="navbar-logo"
              />
              <ul className="navbar-links"></ul>
            </div>

            <div className="navbar-auth">
              <button className="auth-button" onClick={scrollToLogin}>
                Login
              </button>
              <button className="auth-button" onClick={scrollToRegister}>
                Register
              </button>
              <button className="auth-button">Contact</button>
            </div>
          </div>
          <button className="hamburger">☰</button>
        </nav>

        <div className="hero-text">
          <h1>Your bridge between<br />creativity and career</h1>
        </div>
      </div>

      <div className="home-box-container">
        <div className="home-box" ref={loginRef}>
          <h2>Login</h2>
          <p className="subtext">
            Don’t have an account yet? <Link to="/register">Sign Up</Link>
          </p>

          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              placeholder="you@example.com"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />

            <div className="input-row">
              <label>Password</label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <input
              type="password"
              placeholder="Enter 6 characters or more"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="checkbox-row">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="auth-button-main" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <div className="divider">or login with</div>

          <div className="social-buttons">
            <button className="google-button">Google</button>
            <button className="facebook-button">Facebook</button>
          </div>
        </div>

        <div className="home-box" ref={registerRef}>
          <h2>Register</h2>
          <p>New here? Register your account to get started.</p>
          <Link to="/register" className="home-button">Register</Link>
        </div>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-column">
              <h3>SCAD MOA</h3>
              <p>German University in Cairo<br />Cairo, Egypt</p>
              <p>912.525.7191</p>
              <a href="mailto:scad@scad.edu">scadmoa@scad.edu</a>
            </div>

            <div className="footer-column">
              <h3>SCAD</h3>
              <a href="https://scadfash.org" target="_blank" rel="noreferrer">scadfash.org</a>
            </div>

            <div className="footer-column">
              <h3>SCAD Hours</h3>
              <p><strong>MON</strong> 10 a.m. – 5 p.m.</p>
              <p><strong>TUES</strong> Closed</p>
              <p><strong>WED – SAT</strong> 10 a.m. – 5 p.m.</p>
              <p><strong>SUN</strong> Noon – 5 p.m.</p>
              <a href="#">Plan your visit</a>
            </div>

            <div className="footer-column">
              <h3>About SCAD</h3>
              <p>Offering more degree programs and specializations than any other art and design university, SCAD is uniquely qualified to prepare talented students for professional, creative careers.</p>
              <a href="https://www.scad.edu" target="_blank" rel="noreferrer">scad.edu</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default StudentsNavBar;
