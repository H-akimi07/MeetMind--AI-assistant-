import logo from "../assets/meetmind-logo.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="
        border-t border-[rgba(212,175,55,0.15)]
        bg-[#080808]
        px-[8%] pt-[70px] pb-[25px]
      "
      id="contact"
    >
      <div
        className="
          grid
          grid-cols-[2fr_1fr_1fr_1fr]
          gap-[50px]

          max-[900px]:grid-cols-1
          max-[900px]:text-center
        "
      >
        <div>
          <img
            src={logo}
            className="
              mb-5 w-[170px]

              max-[900px]:mx-auto
            "
            alt="MeetMind"
          />

          <p className="leading-[1.7] text-[#999]">
            MeetMind is your AI Meeting Assistant that transforms notes,
            recordings and documents into summaries and action items.
          </p>
        </div>

        <div>
          <h4 className="mb-[15px] text-[#d4af37]">Product</h4>

          <Link
            to="/"
            className="
              mb-[10px] block
              text-[#dcdcdc]
              no-underline
            "
          >
            Home
          </Link>

          <Link
            to="/login"
            className="
              mb-[10px] block
              text-[#dcdcdc]
              no-underline
            "
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
              mb-[10px] block
              text-[#dcdcdc]
              no-underline
            "
          >
            Sign Up
          </Link>
        </div>

        <div>
          <h4 className="mb-[15px] text-[#d4af37]">Resources</h4>

          <a
            href="#features"
            className="
              mb-[10px] block
              text-[#dcdcdc]
              no-underline
            "
          >
            Features
          </a>

          <a
            href="#pricing"
            className="
              mb-[10px] block
              text-[#dcdcdc]
              no-underline
            "
          >
            Pricing
          </a>

          <a
            href="#how"
            className="
              mb-[10px] block
              text-[#dcdcdc]
              no-underline
            "
          >
            How it Works
          </a>
        </div>

        <div>
          <h4 className="mb-[15px] text-[#d4af37]">Contact</h4>

          <p className="leading-[1.7] text-[#999]">support@meetmind.ai</p>

          <p className="leading-[1.7] text-[#999]">Herat, Afghanistan</p>
        </div>
      </div>

      <div
        className="
          mt-12.5
          border-t border-[rgba(255,255,255,0.08)]
          pt-5
          text-center
          text-[#777]
        "
      >
        © 2026 MeetMind. All Rights Reserved.
      </div>
    </footer>
  );
}
