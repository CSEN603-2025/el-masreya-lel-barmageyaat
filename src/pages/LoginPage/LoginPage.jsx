import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import styles from "./LoginPage.module.css";

function LoginPage({ setCurrUser, studentUser, scadUser, companyUser, companyRequests, addNotification }) {
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
      navigate("/ViewCompanyRequest");
      setCurrUser(foundScadUser);
    } else if (foundCompanyUser) {
      setMessage("Login successful! Redirecting to Company Dashboard...");
      
      // Always show an acceptance notification for company users
      if (addNotification) {
        setTimeout(() => {
          addNotification("Your company application has been accepted!", "success");
        }, 1000); // Small delay to ensure notification appears after navigation
      }
      
      // Check for any application status updates
      if (addNotification && foundCompanyUser.internships) {
        foundCompanyUser.internships.forEach(internship => {
          if (internship.applications) {
            internship.applications.forEach(application => {
              if (application.status && !application.statusNotified) {
                // Create notification based on status
                setTimeout(() => {
                  if (application.status === "accepted") {
                    addNotification(`Application from ${application.firstName} ${application.lastName} has been accepted.`, "success");
                  } else if (application.status === "rejected") {
                    addNotification(`Application from ${application.firstName} ${application.lastName} has been rejected.`, "error");
                  }
                }, 1500);
              }
            });
          }
        });
      }
      
      navigate(`/companyViewPostings/`);
      setCurrUser(foundCompanyUser);
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  }

  return (
    <div className={styles.loginContainer}>
      <StudentsNavBar />
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="user" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className={styles.input}
              placeholder="Enter your username"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* here is outputted both because they cant happen at the same time 
        note to self: add styling for this part in the css file */}
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <div className={styles.links}>
          <Link to="/" className={styles.homeLink}>
            Back to Home
          </Link>
          <p className={styles.registerText}>
            Don't have a company account?{" "}
            <Link to="/companyRegister" className={styles.registerLink}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
