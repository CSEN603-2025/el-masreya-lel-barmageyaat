import React from "react";
import { Link } from "react-router-dom";
import styles from "./HomeNavBar.module.css";

function HomeNavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          CareerHub
        </Link>
        <div className={styles.navLinks}>
          <Link to="/login" className={styles.navLink}>
            Login
          </Link>
          <Link to="/companyRegister" className={styles.navButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default HomeNavBar;
