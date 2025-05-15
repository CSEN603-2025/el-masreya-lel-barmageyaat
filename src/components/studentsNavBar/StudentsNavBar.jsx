import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./StudentsNavBar.css";
import scadlogo from "/src/assets/scady.png";

function StudentsNavBar() {
  const loginRef = useRef(null);
  const registerRef = useRef(null);

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

  return (
    <>
      {/* Hero Section with background image */}
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
              <button className="auth-button" onClick={scrollToLogin}>Login</button>
              <button className="auth-button" onClick={scrollToRegister}>Register</button>
              <button className="auth-button">Contact</button>
            </div>
          </div>
          <button className="hamburger">☰</button>
        </nav>

        <div className="hero-text">
          <h1>Your bridge between<br />creativity and career</h1>
        </div>
      </div>

      {/* Scrollable content below */}
      <div className="home-box-container">
        <div className="home-box" ref={loginRef}>
          <h2>Login</h2>
          <p className="subtext">
            Don’t have an account yet? <a href="/register">Sign Up</a>
          </p>

          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" />

          <div className="input-row">
            <label>Password</label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <input type="password" placeholder="Enter 6 characters or more" />

          <div className="checkbox-row">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button className="auth-button-main">Login</button>

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

        {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>SCAD MOA</h3>
            <p>601 Turner Blvd.<br />Savannah, Georgia</p>
            <p>912.525.7191</p>
            <a href="mailto:scadmoa@scad.edu">scadmoa@scad.edu</a>
          </div>

          <div className="footer-column">
            <h3>SCAD FASH</h3>
            <p>Museum of Fashion + Film</p>
            <a href="https://scadfash.org" target="_blank" rel="noreferrer">scadfash.org</a>
          </div>

          <div className="footer-column">
            <h3>Museum Hours</h3>
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
