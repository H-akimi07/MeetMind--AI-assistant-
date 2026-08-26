import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/meetmind-logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* LOGO */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <motion.img
          src={logo}
          alt="MeetMind Logo"
          className="logo-image"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
          }}
        />
      </Link>

      {/* DESKTOP NAVIGATION */}
      <div className="nav-links desktop-links">
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <a href="#features" onClick={closeMenu}>
          Features
        </a>

        <a href="#how" onClick={closeMenu}>
          How It Works
        </a>

        <a href="#pricing" onClick={closeMenu}>
          Pricing
        </a>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </div>

      {/* DESKTOP BUTTONS + HAMBURGER */}
      <div className="nav-buttons">
        {/* Desktop buttons */}
        <div className="desktop-auth-buttons">
          {token ? (
            <Link to="/dashboard" className="dashboard-btn">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/register" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE / TABLET MENU */}
      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
        {/* Mobile Links */}
        <div className="mobile-nav-links">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#how" onClick={closeMenu}>
            How It Works
          </a>

          <a href="#pricing" onClick={closeMenu}>
            Pricing
          </a>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="mobile-auth-buttons">
          {token ? (
            <Link to="/dashboard" className="dashboard-btn" onClick={closeMenu}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-btn" onClick={closeMenu}>
                Login
              </Link>

              <Link to="/register" className="signup-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
