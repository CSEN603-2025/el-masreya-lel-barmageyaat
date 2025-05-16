import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Parallax } from "react-parallax";
import CountUp from "react-countup";
import { useSpring, animated } from "react-spring";
import { FaGraduationCap, FaBuilding, FaUserTie } from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./HomePage.css";

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const features = [
    {
      icon: <FaGraduationCap />,
      title: "Student Portal",
      description:
        "Access internship opportunities, submit reports, and track your progress.",
      link: "/login",
    },
    {
      icon: <FaBuilding />,
      title: "Company Portal",
      description:
        "Post internships, review applications, and manage your interns.",
      link: "/CompanyRegister",
    },
    {
      icon: <FaUserTie />,
      title: "SCAD Portal",
      description:
        "Monitor internships, evaluate reports, and manage the program.",
      link: "/login",
    },
  ];

  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="homepage">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#0f172a",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#3b82f6",
            },
            links: {
              color: "#3b82f6",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Hero Section */}
      <Parallax
        blur={0}
        bgImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
        bgImageAlt="Hero Background"
        strength={200}
        className="hero-section"
      >
        <motion.div
          ref={heroRef}
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ scale }}
        >
          <animated.div style={springProps}>
            <h1>Welcome to SCAD Internship Portal</h1>
            <p>Your gateway to professional growth and career development</p>
            <div className="hero-buttons">
              <Link to="/login" className="primary-button">
                Get Started
              </Link>
              <Link to="/CompanyRegister" className="secondary-button">
                Register Company
              </Link>
            </div>
          </animated.div>
        </motion.div>
      </Parallax>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        className="features-section"
        initial={{ opacity: 0, y: 20 }}
        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h2>Our Services</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link to={feature.link} className="feature-link">
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="stats-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="stats-container">
          <div className="stat-item">
            <h3>
              <CountUp end={500} duration={2.5} suffix="+" />
            </h3>
            <p>Active Internships</p>
          </div>
          <div className="stat-item">
            <h3>
              <CountUp end={100} duration={2.5} suffix="+" />
            </h3>
            <p>Partner Companies</p>
          </div>
          <div className="stat-item">
            <h3>
              <CountUp end={1000} duration={2.5} suffix="+" />
            </h3>
            <p>Successful Placements</p>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join our community of students and companies today</p>
          <Link to="/login" className="cta-button">
            Get Started Now
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
