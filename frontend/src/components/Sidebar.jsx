import { useEffect, useRef, useState } from "react";
import { getProfile, uploadAvatar } from "../api/user.js";
import { Link, useLocation } from "react-router-dom";

import {
  FiHome,
  FiVideo,
  FiPlusCircle,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { motion } from "framer-motion";

import logo from "../assets/meetmind-logo.svg";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      const res = await uploadAvatar(file);

      setUser((prev) => ({
        ...prev,
        avatar: res.data.avatar,
      }));
    } catch (error) {
      console.log("AVATAR UPLOAD ERROR:", error);

      alert("Failed to upload profile picture.");
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 1000) {
      setSidebarOpen(false);
    }
  };

  const [user, setUser] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        setUser(res.data);
      } catch (error) {
        console.log("SIDEBAR PROFILE ERROR:", error);
      }
    };

    loadProfile();
  }, []);

  return (
    <aside
      className={`
        fixed left-0 top-0
        w-[270px]
        h-screen
        bg-[#0a0a0a]
        border-r border-[#242424]
        py-[30px] px-5
        flex flex-col
        justify-between
        transition-transform duration-[350ms]
        z-[2000]
        max-[1000px]:-translate-x-full
        max-[1000px]:shadow-[10px_0_40px_rgba(0,0,0,0.6)]
        ${sidebarOpen ? "max-[1000px]:translate-x-0" : ""}
      `}
    >
      {/* CLOSE */}

      <button
        className="
          hidden
          max-[1000px]:flex
          items-center justify-center
          w-9 h-9
          self-end
          bg-[#151515]
          border border-[#333]
          rounded-[10px]
          text-white
          text-[20px]
          cursor-pointer
          mb-[15px]
        "
        onClick={() => setSidebarOpen(false)}
      >
        ✕
      </button>

      {/* LOGO */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img
          src={logo}
          alt="MeetMind"
          className="
            w-40
            block
            mx-auto
            mb-[22px]
          "
        />
      </motion.div>

      {/* MENU */}

      <div className="flex flex-col gap-2">
        <Link
          to="/dashboard"
          onClick={closeSidebar}
          className={`
            flex items-center gap-[14px]
            py-[14px] px-[18px]
            rounded-[14px]
            no-underline
            text-[#a9a9a9]
            text-[15px]
            transition-all duration-300
            hover:bg-[#171717]
            hover:text-[#d4af37]
            hover:translate-x-[6px]
            ${
              location.pathname === "/dashboard"
                ? "bg-[rgba(212,175,55,0.12)] text-[#d4af37] border border-[rgba(212,175,55,0.25)]"
                : ""
            }
          `}
        >
          <FiHome />
          Dashboard
        </Link>

        <Link
          to="/meetings"
          onClick={closeSidebar}
          className={`
            flex items-center gap-[14px]
            py-[14px] px-[18px]
            rounded-[14px]
            no-underline
            text-[#a9a9a9]
            text-[15px]
            transition-all duration-300
            hover:bg-[#171717]
            hover:text-[#d4af37]
            hover:translate-x-[6px]
            ${
              location.pathname === "/meetings"
                ? "bg-[rgba(212,175,55,0.12)] text-[#d4af37] border border-[rgba(212,175,55,0.25)]"
                : ""
            }
          `}
        >
          <FiVideo />
          Meetings
        </Link>

        <Link
          to="/create-meeting"
          onClick={closeSidebar}
          className={`
            flex items-center gap-[14px]
            py-[14px] px-[18px]
            rounded-[14px]
            no-underline
            text-[#a9a9a9]
            text-[15px]
            transition-all duration-300
            hover:bg-[#171717]
            hover:text-[#d4af37]
            hover:translate-x-[6px]
            ${
              location.pathname === "/create-meeting"
                ? "bg-[rgba(212,175,55,0.12)] text-[#d4af37] border border-[rgba(212,175,55,0.25)]"
                : ""
            }
          `}
        >
          <FiPlusCircle />
          Create Meeting
        </Link>

        <Link
          to="/join-meeting"
          onClick={closeSidebar}
          className={`
            flex items-center gap-[14px]
            py-[14px] px-[18px]
            rounded-[14px]
            no-underline
            text-[#a9a9a9]
            text-[15px]
            transition-all duration-300
            hover:bg-[#171717]
            hover:text-[#d4af37]
            hover:translate-x-[6px]
            ${
              location.pathname === "/join-meeting"
                ? "bg-[rgba(212,175,55,0.12)] text-[#d4af37] border border-[rgba(212,175,55,0.25)]"
                : ""
            }
          `}
        >
          <FiUsers />
          Join Meeting
        </Link>

        <Link
          to="/settings"
          onClick={closeSidebar}
          className={`
            flex items-center gap-[14px]
            py-[14px] px-[18px]
            rounded-[14px]
            no-underline
            text-[#a9a9a9]
            text-[15px]
            transition-all duration-300
            hover:bg-[#171717]
            hover:text-[#d4af37]
            hover:translate-x-[6px]
            ${
              location.pathname === "/settings"
                ? "bg-[rgba(212,175,55,0.12)] text-[#d4af37] border border-[rgba(212,175,55,0.25)]"
                : ""
            }
          `}
        >
          <FiSettings />
          Settings
        </Link>
      </div>

      {/* PROFILE */}

      <div
        className="
          flex items-center gap-3
          py-[10px] px-[10px]
          mb-[18px]
          rounded-[14px]
          bg-[#111]
          border border-[#222]
          transition-all duration-300
          hover:bg-[#171717]
          hover:border-[rgba(212,175,55,0.35)]
          hover:-translate-y-0.5
        "
      >
        <button
          type="button"
          className="
            relative
            w-[46px] h-[46px]
            p-0
            border-0
            bg-transparent
            cursor-pointer
            shrink-0
          "
          onClick={handleAvatarClick}
        >
          <img
            src={
              user?.avatar?.startsWith("blob:")
                ? user.avatar
                : user?.avatar
                  ? `https://meetmind-ai-assistant.onrender.com${user.avatar}`
                  : "/default-avatar.png"
            }
            alt="Profile"
            className="
              w-[46px] h-[46px]
              block
              rounded-full
              object-cover
              border-2 border-[#d4af37]
              bg-[#1a1a1a]
            "
          />

          <span
            className="
              absolute
              right-[-2px]
              bottom-[-2px]
              w-[17px] h-[17px]
              flex items-center justify-center
              bg-[#d4af37]
              text-[#050505]
              rounded-full
              text-[14px]
              font-bold
              border-2 border-[#111]
              transition-transform
              group-hover:scale-110
            "
          >
            +
          </span>
        </button>

        <Link
          to="/profile"
          onClick={closeSidebar}
          className="
            flex flex-col
            min-w-0
            no-underline
          "
        >
          <strong
            className="
              text-white
              text-[14px]
              font-semibold
              whitespace-nowrap
              overflow-hidden
              text-ellipsis
            "
          >
            {user?.name || "User"}
          </strong>

          <span className="text-[#777] text-[11px] mt-[3px]">View Profile</span>
        </Link>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          hidden
        />
      </div>

      {/* LOGOUT */}

      <button
        className="
          flex items-center justify-center
          gap-[10px]
          w-full
          py-[14px]
          border-0
          rounded-[14px]
          bg-[#8b0000]
          text-white
          cursor-pointer
          font-semibold
          transition-colors duration-300
          hover:bg-[#991b1bd1]
        "
        onClick={logout}
      >
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
