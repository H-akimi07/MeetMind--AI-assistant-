import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiCheck,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { motion } from "framer-motion";

import API from "../api/axios";

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

  const strength = getStrength();

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
      console.log("RESPONSE:", err.response);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.message);

      setError(
        err.response?.data?.message || err.message || "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#555]";

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />

      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#B8860B]/10 blur-[150px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04),transparent_45%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 py-12 lg:flex-row lg:justify-between lg:px-12">
        {/* Left */}
        <motion.div
          className="w-full max-w-xl text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 text-3xl font-bold tracking-tight text-white">
            <span className="text-[#D4AF37]">Meet</span>Mind
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs font-medium text-[#D4AF37]">
            <FiShield />
            AI-powered meeting intelligence
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Join the Future of{" "}
            <span className="text-[#D4AF37]">AI Meetings</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#888] sm:text-lg">
            Transform meetings into AI-powered summaries, tasks, decisions and
            meaningful collaboration.
          </p>

          {/* Features */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-xl">
            {[
              ["🤖", "AI Summaries"],
              ["⚡", "Instant Insights"],
              ["🔒", "Secure Meetings"],
            ].map(([icon, title]) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
              >
                <div className="mb-3 text-2xl">{icon}</div>

                <span className="text-xs font-medium text-[#aaa]">{title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSignup}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full max-w-[460px] overflow-hidden rounded-[28px] border border-[#D4AF37]/20 bg-white/[0.04] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9"
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiUser size={20} />
            </div>

            <h2 className="text-2xl font-bold text-white">Create Account</h2>

            <p className="mt-2 text-xs text-[#666]">
              Start turning your meetings into insights.
            </p>
          </div>

          {/* Name */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#292929] bg-[#0b0b0b] px-4 transition-all focus-within:border-[#D4AF37]/60 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <FiUser className="shrink-0 text-[#D4AF37]" />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#292929] bg-[#0b0b0b] px-4 transition-all focus-within:border-[#D4AF37]/60 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <FiMail className="shrink-0 text-[#D4AF37]" />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-[#292929] bg-[#0b0b0b] px-4 transition-all focus-within:border-[#D4AF37]/60 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <FiLock className="shrink-0 text-[#D4AF37]" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="!m-0 !w-auto !bg-transparent !p-0 !text-[#D4AF37] !shadow-none hover:!translate-y-0"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Strength */}
          <div className="mb-4 flex items-center justify-between px-1 text-xs">
            <span className="text-[#666]">Password strength</span>

            <span
              className={
                strength === "Strong"
                  ? "font-semibold text-green-400"
                  : strength === "Medium"
                    ? "font-semibold text-yellow-400"
                    : "font-semibold text-red-400"
              }
            >
              {strength}
            </span>
          </div>

          {/* Confirm */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#292929] bg-[#0b0b0b] px-4 transition-all focus-within:border-[#D4AF37]/60 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <FiLock className="shrink-0 text-[#D4AF37]" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="!m-0 !w-auto !bg-transparent !p-0 !text-[#D4AF37] !shadow-none hover:!translate-y-0"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Terms */}
          <label className="mb-5 flex cursor-pointer items-start gap-3 text-xs text-[#777]">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 accent-[#D4AF37]"
            />

            <span>
              I agree to the{" "}
              <span className="text-[#D4AF37]">Terms & Privacy Policy</span>
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] bg-[length:200%_100%] px-5 py-3.5 font-bold text-black transition-all duration-300 hover:bg-[position:100%_0] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}

            {!loading && (
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            )}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#292929]" />
            <span className="text-xs text-[#555]">OR</span>
            <div className="h-px flex-1 bg-[#292929]" />
          </div>

          {/* Google */}
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#292929] bg-[#0b0b0b] px-5 py-3 text-sm font-medium text-white opacity-60"
          >
            Google Sign-In
            <span className="text-[10px] text-[#666]">Coming Soon</span>
          </button>

          {/* Sign in */}
          <p className="mt-7 text-center text-xs text-[#666]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#D4AF37] transition hover:text-[#FFD700]"
            >
              Sign In
            </Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#444]">
            <FiCheck className="text-[#D4AF37]" />
            Your information is securely protected
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default Register;
