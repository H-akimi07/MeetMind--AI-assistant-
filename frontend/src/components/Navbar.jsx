import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/meetmind-logo.svg";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      className="
        fixed top-0 left-0 right-0
        h-[100px]
        flex items-center justify-between
        px-[70px]
        bg-[rgba(8,8,8,0.85)]
        backdrop-blur-[18px]
        border-b border-[rgba(212,175,55,0.12)]
        z-[999]
        overflow-visible
        max-[1000px]:px-[30px]
        max-[768px]:h-20
        max-[768px]:px-[18px]
        max-[768px]:gap-[10px]
        max-[768px]:flex-nowrap
        max-[480px]:h-[72px]
        max-[480px]:px-3
        max-[480px]:gap-[6px]
      "
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* LOGO */}

      <Link
        to="/"
        className="
          flex items-center
          h-full
          m-0
          overflow-visible
          shrink-0
          max-[768px]:order-1
          max-[768px]:h-20
          max-[480px]:h-[72px]
        "
      >
        <motion.img
          src={logo}
          alt="MeetMind Logo"
          className="
            w-[100px] h-[100px]
            p-0
            block
            object-contain
            drop-shadow-[0_10px_15px_#d4af3759]
            max-[1000px]:h-[70px]
            max-[768px]:w-[75px]
            max-[768px]:h-[75px]
            max-[480px]:w-[65px]
            max-[480px]:h-[65px]
          "
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

      {/* DESKTOP NAV */}

      <div className="max-[768px]:hidden">
        <div
          className="
            flex items-center
            gap-[34px]
            max-[1000px]:gap-[18px]
          "
        >
          <Link
            to="/"
            className="
              text-[#a5a5a5]
              no-underline
              transition-colors duration-300
              hover:text-[#d4af37]
            "
          >
            Home
          </Link>

          <a
            href="#features"
            className="
              text-[#a5a5a5]
              no-underline
              transition-colors duration-300
              hover:text-[#d4af37]
            "
          >
            Features
          </a>

          <a
            href="#how"
            className="
              text-[#a5a5a5]
              no-underline
              transition-colors duration-300
              hover:text-[#d4af37]
            "
          >
            How It Works
          </a>

          <a
            href="#pricing"
            className="
              text-[#a5a5a5]
              no-underline
              transition-colors duration-300
              hover:text-[#d4af37]
            "
          >
            Pricing
          </a>

          <Link
            to="/contact"
            className="
              text-[#a5a5a5]
              no-underline
              transition-colors duration-300
              hover:text-[#d4af37]
            "
          >
            Contact
          </Link>
        </div>
      </div>

      {/* BUTTONS */}

      <div
        className="
          flex items-center gap-[15px]
          max-[768px]:order-2
          max-[768px]:ml-auto
          max-[768px]:gap-2
          max-[480px]:gap-[5px]
        "
      >
        {token ? (
          <Link
            to="/dashboard"
            className="
              bg-transparent
              border-[0.5px] border-[#d4af37]
              py-3 px-[25px]
              rounded-[12px]
              no-underline
              font-bold
              text-white
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)]
              max-[768px]:py-[9px]
              max-[768px]:px-4
              max-[768px]:text-[14px]
              max-[768px]:rounded-[10px]
              max-[480px]:py-2
              max-[480px]:px-3
              max-[480px]:text-[13px]
              max-[480px]:rounded-[9px]
            "
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="
                py-[10px] px-[22px]
                text-white
                no-underline
                max-[768px]:py-[9px]
                max-[768px]:px-3
                max-[768px]:text-[14px]
                max-[480px]:py-2
                max-[480px]:px-2
                max-[480px]:text-[13px]
              "
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                bg-transparent
                border-[0.5px] border-[#d4af37]
                py-3 px-[25px]
                rounded-[12px]
                no-underline
                font-bold
                text-white
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)]
                max-[768px]:py-[9px]
                max-[768px]:px-4
                max-[768px]:text-[14px]
                max-[768px]:rounded-[10px]
                max-[480px]:py-2
                max-[480px]:px-3
                max-[480px]:text-[13px]
                max-[480px]:rounded-[9px]
              "
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* HAMBURGER */}

      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          hidden
          max-[768px]:order-3
          max-[768px]:flex
          max-[768px]:w-[42px]
          max-[768px]:h-[42px]
          max-[768px]:items-center
          max-[768px]:justify-center
          max-[768px]:text-[27px]
          max-[768px]:text-[#d4af37]
          max-[768px]:cursor-pointer
          max-[768px]:shrink-0
          max-[768px]:z-[1001]
          max-[480px]:w-[38px]
          max-[480px]:h-[38px]
          max-[480px]:text-[25px]
        "
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* MOBILE MENU */}

      <div
        className={`
          fixed
          top-20
          left-[-100%]
          w-full
          h-[calc(100vh-80px)]
          bg-[#080808]
          flex flex-col
          justify-center
          items-center
          gap-[35px]
          transition-[left] duration-400 ease
          z-[998]
          ${menuOpen ? "left-0" : ""}
          max-[480px]:top-[72px]
          max-[480px]:h-[calc(100vh-72px)]
        `}
      >
        <div className="flex flex-col items-center gap-[25px] text-center">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-[20px] text-[#aaa] no-underline hover:text-[#d4af37]"
          >
            Home
          </Link>

          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-[20px] text-[#aaa] no-underline hover:text-[#d4af37]"
          >
            Features
          </a>

          <a
            href="#how"
            onClick={() => setMenuOpen(false)}
            className="text-[20px] text-[#aaa] no-underline hover:text-[#d4af37]"
          >
            How It Works
          </a>

          <a
            href="#pricing"
            onClick={() => setMenuOpen(false)}
            className="text-[20px] text-[#aaa] no-underline hover:text-[#d4af37]"
          >
            Pricing
          </a>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-[20px] text-[#aaa] no-underline hover:text-[#d4af37]"
          >
            Contact
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
