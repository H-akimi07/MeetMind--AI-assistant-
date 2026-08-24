import { useState } from "react";

import { FiMail, FiLock, FiLogIn, FiCheck } from "react-icons/fi";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import "./Login.css";

import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to continue to MeetMind">
      <form onSubmit={handleLogin} className="login-form">
        {/* EMAIL */}

        <div className="input-group">
          <label>
            <FiMail />
            Email
          </label>

          <div className="login-input-box">
            <FiMail />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div className="input-group">
          <label>
            <FiLock />
            Password
          </label>

          <div className="password-box">
            <FiLock />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
        </div>

        {/* ERROR */}

        {error && <p className="auth-error">{error}</p>}

        {/* OPTIONS */}

        <div className="options-row">
          <label className="remember">
            <span
              className={`remember-checkbox ${rememberMe ? "checked" : ""}`}
            >
              {rememberMe && <FiCheck />}

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </span>
            Remember me
          </label>

          <div className="forgot-row">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>

        {/* LOGIN */}

        <button type="submit" className="login-btn" disabled={loading}>
          <FiLogIn />

          {loading ? "Signing In..." : "Login"}
        </button>

        {/* DIVIDER */}

        <div className="divider">
          <span>OR</span>
        </div>

        {/* GOOGLE */}

        <button type="button" className="google-btn">
          <FcGoogle />
          Continue with Google
          <small>Coming Soon</small>
        </button>

        {/* REGISTER */}

        <p className="switch-auth">
          Don't have an account?
          <Link to="/register">Create one</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
