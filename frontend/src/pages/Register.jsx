import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiCpu,
  FiZap,
  FiShield,
  FiCheck,
} from "react-icons/fi";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

import API from "../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const getStrength = () => {
    if (password.length < 6) return "Weak";

    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      return "Strong";
    }

    return "Medium";
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms & Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log("REGISTER ERROR:", err);

      setError(
        err.response?.data?.message || err.message || "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="background-glow glow1"></div>
      <div className="background-glow glow2"></div>

      {/* LEFT SIDE */}

      <div className="signup-left">
        <div className="logo">
          <span>Meet</span>Mind
        </div>

        <h1>
          Join the Future of
          <span> AI Meetings</span>
        </h1>

        <p>
          Transform meetings into AI-powered summaries, tasks, decisions and
          collaboration.
        </p>

        <div className="stats">
          {/* AI Summaries */}

          <div className="stat">
            <div className="stat-icon">
              <FiCpu />
            </div>

            <span>AI Summaries</span>
          </div>

          {/* Instant Insights */}

          <div className="stat">
            <div className="stat-icon">
              <FiZap />
            </div>

            <span>Instant Insights</span>
          </div>

          {/* Secure Meetings */}

          <div className="stat">
            <div className="stat-icon">
              <FiShield />
            </div>

            <span>Secure Meetings</span>
          </div>
        </div>
      </div>

      {/* REGISTER CARD */}

      <motion.form
        className="signup-card"
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2>Create Account</h2>

        {/* NAME */}

        <div className="input-box">
          <FiUser />

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* EMAIL */}

        <div className="input-box">
          <FiMail />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}

        <div className="input-box">
          <FiLock />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* PASSWORD STRENGTH */}

        <div className="strength">
          <span>Password strength</span>

          <span className={getStrength().toLowerCase()}>{getStrength()}</span>
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="input-box">
          <FiLock />

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* TERMS */}

        <label className="terms">
          <span className={`custom-checkbox ${acceptTerms ? "checked" : ""}`}>
            {acceptTerms && <FiCheck />}

            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
          </span>

          <span>I agree to the Terms & Privacy Policy</span>
        </label>

        {/* ERROR */}

        {error && <p className="auth-error">{error}</p>}

        {/* CREATE ACCOUNT */}

        <button type="submit" className="register-main-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Account...
            </>
          ) : (
            <>
              <FiCheck />
              Create Account
            </>
          )}
        </button>

        {/* DIVIDER */}

        <div className="divider">OR</div>

        {/* GOOGLE */}

        <button type="button" className="google" disabled>
          <FcGoogle />

          <span>Google Sign-In</span>

          <small>Coming Soon</small>
        </button>

        {/* LOGIN */}

        <p className="signin">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Register;
