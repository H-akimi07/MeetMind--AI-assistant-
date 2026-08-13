import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/forgot-password", { email });

      toast.success("If this email exists, a reset link has been sent.");
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div
      className="
        relative flex min-h-screen
        items-center justify-center
        overflow-hidden
        bg-[#050505]
        px-5
      "
    >
      {/* GOLD GLOW */}

      <div
        className="
          pointer-events-none absolute
          left-1/2 top-1/2
          h-[500px] w-[500px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(212,175,55,0.12),transparent_70%)]
          blur-[60px]
        "
      />

      {/* CARD */}

      <div
        className="
          relative z-10
          w-full max-w-[440px]
          rounded-[28px]
          border border-[rgba(212,175,55,0.2)]
          bg-[rgba(15,15,15,0.9)]
          p-[45px]
          shadow-[0_25px_80px_rgba(0,0,0,0.6)]
          backdrop-blur-xl
          max-sm:p-[30px]
        "
      >
        {/* LOGO */}

        <div className="mb-8 text-center">
          <div
            className="
              mx-auto mb-5
              flex h-[58px] w-[58px]
              items-center justify-center
              rounded-2xl
              border border-[rgba(212,175,55,0.3)]
              bg-[rgba(212,175,55,0.08)]
              text-2xl
              text-[#d4af37]
              shadow-[0_0_30px_rgba(212,175,55,0.08)]
            "
          >
            🔐
          </div>

          <h1 className="mb-2 text-[28px] font-bold text-white">
            Forgot Password?
          </h1>

          <p className="text-[14px] leading-6 text-[#888]">
            No worries. Enter your email and we'll send you a secure link to
            reset your password.
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-[13px] font-medium text-[#bbb]">
            Email Address
          </label>

          <div className="relative mb-5">
            <span
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#777]
              "
            >
              ✉
            </span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                h-[52px] w-full
                rounded-xl
                border border-[#292929]
                bg-[#090909]
                pl-[45px] pr-4
                text-[14px] text-white
                outline-none
                placeholder:text-[#555]
                transition-all duration-300
                focus:border-[#d4af37]
                focus:bg-[#0c0c0c]
                focus:shadow-[0_0_20px_rgba(212,175,55,0.12)]
              "
            />
          </div>

          <button
            type="submit"
            className="
              group
              flex h-[52px] w-full
              items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r from-[#d4af37] to-[#f1d36b]
              font-bold text-[#080808]
              shadow-[0_10px_30px_rgba(212,175,55,0.15)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_15px_35px_rgba(212,175,55,0.25)]
              active:translate-y-0
            "
          >
            Send Reset Link
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </form>

        {/* SECURITY NOTE */}

        <div
          className="
            mt-6
            rounded-xl
            border border-[rgba(255,255,255,0.06)]
            bg-[rgba(255,255,255,0.025)]
            p-3
            text-center
            text-[11px]
            leading-5
            text-[#666]
          "
        >
          🔒 Your account security is important to us.
        </div>

        <p className="mt-6 text-center text-[12px] text-[#555]">
          MeetMind AI Meeting Assistant
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
