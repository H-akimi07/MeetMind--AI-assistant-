import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

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

      if (rememberMe) {
        localStorage.setItem("token", res.data.token);
      } else {
        sessionStorage.setItem("token", res.data.token);
      }

      console.log("LOGIN RESPONSE:", res.data);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to continue to MeetMind">
      <form onSubmit={handleLogin} className="flex flex-col gap-[14px]">
        {/* EMAIL */}
        <div className="flex flex-col gap-[5px]">
          <label
            className="
              text-[14px]
              font-medium
              tracking-[0.5px]
              text-[#D4AF37]
            "
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
              w-full
              rounded-[14px]
              border border-[#2e2e2e]
              bg-[rgba(12,12,12,0.9)]
              px-4 py-3
              text-[15px] text-white
              transition-all duration-300
              placeholder:text-[#666]
              focus:border-[#D4AF37]
              focus:bg-[#111]
              focus:outline-none
              focus:ring-0
              focus:shadow-[0_0_20px_rgba(212,175,55,0.25)]
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-[5px]">
          <label
            className="
              text-[14px]
              font-medium
              tracking-[0.5px]
              text-[#D4AF37]
            "
          >
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full
                rounded-[14px]
                border border-[#2e2e2e]
                bg-[rgba(12,12,12,0.9)]
                px-4 py-3 pr-[55px]
                text-[15px] text-white
                transition-all duration-300
                placeholder:text-[#666]
                focus:border-[#D4AF37]
                focus:bg-[#111]
                focus:outline-none
                focus:ring-0
                focus:shadow-[0_0_20px_rgba(212,175,55,0.25)]
              "
            />

            <button
              type="button"
              className="
                absolute right-[15px] top-1/2
                -translate-y-1/2
                border-none
                bg-transparent
                text-[18px]
                text-[#D4AF37]
                cursor-pointer
              "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p
            className="
              rounded-[10px]
              border border-[rgba(255,107,107,0.25)]
              bg-[rgba(255,107,107,0.08)]
              p-2
              text-center text-[13px]
              text-[#ff6b6b]
            "
          >
            {error}
          </p>
        )}

        {/* OPTIONS */}
        <div
          className="
            flex flex-col
            items-start
            justify-between
            gap-[10px]
            mb-2
            mt-[-5px]
            sm:flex-row
            sm:items-center
            sm:gap-[15px]
          "
        >
          <label
            className="
              flex cursor-pointer
              items-center gap-2
              text-[14px] text-[#bbb]
            "
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="
                h-4 w-4
                accent-[#D4AF37]
              "
            />
            Remember me
          </label>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="
                text-[14px]
                text-[#B8B8B8]
                no-underline
                transition-colors
                hover:text-[#D4AF37]
              "
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            cursor-pointer
            rounded-[14px]
            border-none
            bg-[linear-gradient(135deg,#B8860B,#FFD700,#B8860B)]
            bg-[length:220%]
            px-4 py-[13px]
            text-center
            text-[16px]
            font-bold
            text-[#111]
            transition-all duration-500
            hover:-translate-y-[3px]
            hover:bg-[position:right]
            hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        {/* DIVIDER */}
        <div
          className="
            flex items-center gap-3
            text-[13px] text-[#777]
          "
        >
          <span className="h-px flex-1 bg-[#333]" />

          <span>OR</span>

          <span className="h-px flex-1 bg-[#333]" />
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          className="
            cursor-pointer
            rounded-[14px]
            border border-[#333]
            bg-[#111]
            px-4 py-[13px]
            text-[15px]
            text-white
            transition-all
            hover:border-[#D4AF37]
            hover:bg-[#151515]
            hover:text-[#D4AF37]
          "
        >
          Continue with Google
        </button>

        {/* REGISTER */}
        <p
          className="
            mt-[5px]
            text-center
            text-[#999]
          "
        >
          Don't have an account?
          <Link
            to="/register"
            className="
              ml-1
              font-semibold
              text-[#D4AF37]
              no-underline
              hover:underline
            "
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
