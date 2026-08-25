import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/meetmind-logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo */}

      <Link to="/" className="logo">
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

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation */}

      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <div className="nav-links">
          <Link to="/">Home</Link>

          <a href="#features">Features</a>

          <a href="#how">How It Works</a>

          <a href="#pricing">Pricing</a>

          <Link to="/contact">Contact</Link>
        </div>
      </div>

      {/* Buttons */}

      <div className="nav-buttons">
        {token ? (
          <Link to="/dashboard" className="gold-btn">
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
    </motion.nav>
  );
}

export default Navbar;
