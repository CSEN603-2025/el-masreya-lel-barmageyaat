import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./LoginPage.css";

const LoginPage = ({ setCurrUser, studentUser, scadUser, companyUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Search for the user in the array of objects
    const foundStudentUser = studentUser.find(
      (student) =>
        student.username === formData.username &&
        student.password === formData.password
    );
    const foundScadUser = scadUser.find(
      (scad) =>
        scad.username === formData.username &&
        scad.password === formData.password
    );
    const foundCompanyUser = companyUser.find(
      (company) =>
        company.username === formData.username &&
        company.password === formData.password
    );

    // If found do this
    if (foundStudentUser) {
      setSuccess("Login successful! Redirecting to Student Dashboard...");
      setCurrUser(foundStudentUser);
      setTimeout(() => {
        navigate("/studentsDashboard");
      }, 1500);
    } else if (foundScadUser) {
      setSuccess("Login successful! Redirecting to SCAD Dashboard...");
      setCurrUser(foundScadUser);
      setTimeout(() => {
        navigate("/scad-dashboard");
      }, 1500);
    } else if (foundCompanyUser) {
      setSuccess("Login successful! Redirecting to Company Dashboard...");
      setCurrUser(foundCompanyUser);
      setTimeout(() => {
        navigate("/companyViewPostings");
      }, 1500);
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#f0f9ff",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ["#3b82f6", "#2563eb", "#60a5fa"],
            },
            links: {
              color: "#3b82f6",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="login-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to continue your journey
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </motion.button>
        </form>

        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/" className="register-link">
            Back to Home
          </Link>
          <p>
            Don't have a company account?{" "}
            <Link to="/companyRegister" className="register-link">
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
