import "./Sidebar.css";
import { useRef } from "react";
import { uploadAvatar } from "../api/user.js";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  FiHome,
  FiVideo,
  FiPlusCircle,
  FiUsers,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { motion } from "framer-motion";

import logo from "../assets/meetmind-logo.svg";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user, updateAvatar } = useUser();

  const fileInputRef = useRef(null);
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

      updateAvatar(res.data.avatar);
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

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       const res = await getProfile();

  //       setUser(res.data);
  //     } catch (error) {
  //       console.log("SIDEBAR PROFILE ERROR:", error);
  //     }
  //   };

  //   loadProfile();
  // }, []);

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
        ✕
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src={logo} alt="MeetMind" className="logo-image" />
      </motion.div>

      <div className="menu">
        <Link
          to="/dashboard"
          onClick={closeSidebar}
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          <FiHome />
          Dashboard
        </Link>

        <Link
          to="/meetings"
          onClick={closeSidebar}
          className={location.pathname === "/meetings" ? "active" : ""}
        >
          <FiVideo />
          Meetings
        </Link>

        <Link
          to="/create-meeting"
          onClick={closeSidebar}
          className={location.pathname === "/create-meeting" ? "active" : ""}
        >
          <FiPlusCircle />
          Create Meeting
        </Link>

        <Link
          to="/join-meeting"
          onClick={closeSidebar}
          className={location.pathname === "/join-meeting" ? "active" : ""}
        >
          <FiUsers />
          Join Meeting
        </Link>

        <Link to="/profile">
          <FiUser />
          <span>Profile</span>
        </Link>
      </div>
      <div className="sidebar-profile">
        <button
          type="button"
          className="avatar-button"
          onClick={handleAvatarClick}
        >
          {user?.avatar ? (
            <img
              src={
                user.avatar.startsWith("blob:")
                  ? user.avatar
                  : `https://meetmind-ai-assistant.onrender.com${user.avatar}`
              }
              alt="Profile"
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-default-avatar">
              <FiUser />
            </div>
          )}
          {/* <span className="avatar-camera">+</span> */}
        </button>

        <Link
          to="/profile"
          onClick={closeSidebar}
          className="sidebar-user-info"
        >
          <strong>{user?.name || "User"}</strong>

          <span>View Profile</span>
        </Link>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          hidden
        />
      </div>

      <button className="logout-btn" onClick={logout}>
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
