import { useState } from "react";
import EditMeeting from "./EditMeeting";
import { deleteMeeting } from "../api/meeting.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiCalendar,
  FiKey,
  FiExternalLink,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";

import "./MeetingCard.css";

function MeetingCard({ meeting }) {
  const { _id, title, scheduledAt, status, meetingCode } = meeting;

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting?",
    );

    if (!confirmDelete) return;

    try {
      await deleteMeeting(_id);

      toast.success("Meeting deleted");

      window.location.reload();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <div className="meeting-card">
      <div className="meeting-card-header">
        <div>
          <h3>{title}</h3>

          <div className="meeting-info">
            <p>
              <FiCalendar />
              {new Date(scheduledAt).toLocaleDateString()}
            </p>

            <p className="meeting-code">
              <FiKey />
              Code: {meetingCode}
            </p>
          </div>
        </div>

        <span className={`meeting-status ${status}`}>{status}</span>
      </div>

      <div className="card-buttons">
        <button
          type="button"
          className="open-meeting-btn"
          onClick={() => {
            console.log("OPEN MEETING CLICKED");
            console.log("Meeting ID:", _id);

            navigate(`/meetings/${_id}`);
          }}
        >
          <FiExternalLink />
          Open Meeting
        </button>

        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          <FiEdit3 />
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <FiTrash2 />
          Delete
        </button>
      </div>

      {editing && (
        <EditMeeting meeting={meeting} close={() => setEditing(false)} />
      )}
    </div>
  );
}

export default MeetingCard;


























































css:
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 70px;
  background: rgba(8, 8, 8, 0.85);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.12);
  z-index: 999;
  overflow: visible;
}

.logo {
  margin: 0 !important;
  display: flex;
  align-items: center;
  height: 100%;
  overflow: visible;
  flex-shrink: 0;
}

.logo-image {
  width: 100px;
  height: 100px;
  padding: 0;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 10px 15px #d4af3759);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 34px;
}

.nav-links a {
  color: #a5a5a5;

  text-decoration: none;

  transition: 0.3s;
}

.nav-links a:hover {
  color: #d4af37;
}

.nav-buttons {
  display: flex;
  align-items: center;

  gap: 15px;
}

.login-btn {
  padding: 10px 22px;

  color: white;

  text-decoration: none;
}

.gold-btn {
  background: transparent;
  border: 0.5px solid #d4af37;

  padding: 12px 25px;

  border-radius: 12px;

  text-decoration: none;

  font-weight: bold;

  color: white;

  transition: 0.3s;
}

.gold-btn:hover {
  transform: translateY(-2px);

  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.35);
}

.menu-icon {
  display: none;
  font-size: 28px;
  color: #d4af37;
  cursor: pointer;
  z-index: 1001;
  flex-shrink: 0;
}

@media (max-width: 1000px) {
  .navbar {
    padding: 0 30px;
  }

  .nav-links {
    gap: 18px;
  }

  .logo-image {
    height: 70px;
  }
}

/* 
   MOBILE NAVBAR
    */

@media (max-width: 768px) {
  /* 
   NAVBAR
 */

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 70px;

    background: rgba(8, 8, 8, 0.85);
    backdrop-filter: blur(18px);

    border-bottom: 1px solid rgba(212, 175, 55, 0.12);

    z-index: 999;
  }

  /* 
   LOGO
 */

  .logo {
    display: flex;
    align-items: center;

    height: 100%;
    margin: 0;
    padding: 0;

    flex-shrink: 0;
  }

  .logo-image {
    width: 100px;
    height: 100px;

    display: block;
    object-fit: contain;

    margin: 0 !important;

    filter: drop-shadow(0 10px 15px #d4af3759);
  }

  /* 
   NORMAL NAV LINKS
 */

  .nav-links {
    display: flex;
    align-items: center;
    gap: 35px;
  }

  .nav-links a {
    color: #aaa;
    text-decoration: none;
    transition: 0.3s;
  }

  .nav-links a:hover {
    color: #d4af37;
  }

  /* 
   NAV BUTTONS
 */

  .nav-buttons {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .login-btn {
    padding: 10px 22px;
    color: white;
    text-decoration: none;
  }

  .gold-btn {
    background: transparent;
    border: 0.5px solid #d4af37;

    padding: 12px 25px;

    border-radius: 12px;

    text-decoration: none;
    font-weight: bold;
    color: white;

    transition: 0.3s;
  }

  .gold-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(212, 175, 55, 0.35);
  }

  /* 
   HAMBURGER
 */

  .menu-icon {
    display: none;

    width: 42px;
    height: 42px;

    align-items: center;
    justify-content: center;

    font-size: 28px;
    color: #d4af37;

    cursor: pointer;

    flex-shrink: 0;

    z-index: 1001;
  }

  /* 
   MOBILE NAVIGATION
 */

  @media (max-width: 768px) {
    .navbar {
      height: 80px;

      padding: 0 18px;

      display: flex;
      flex-direction: row;

      align-items: center;
      justify-content: space-between;

      flex-wrap: nowrap;

      gap: 10px;
    }

    /* LOGO LEFT */

    .logo {
      order: 1;

      width: auto;
      height: 80px;

      display: flex;
      align-items: center;
      justify-content: flex-start;

      flex-shrink: 0;

      margin: 0;
      padding: 0;
    }

    .logo-image {
      width: 75px;
      height: 75px;

      object-fit: contain;
    }

    /* HIDE NORMAL LINKS */

    .nav-links {
      display: none;
    }

    /* RIGHT SIDE:
       DASHBOARD + HAMBURGER
    */

    .nav-buttons {
      order: 2;

      margin-left: auto;

      display: flex;
      flex-direction: row;

      align-items: center;
      justify-content: flex-end;

      gap: 8px;

      width: auto;

      flex-shrink: 0;
    }

    /* DASHBOARD */

    .gold-btn {
      padding: 9px 16px;

      font-size: 14px;

      border-radius: 10px;

      white-space: nowrap;
    }

    .login-btn {
      padding: 9px 12px;

      font-size: 14px;

      white-space: nowrap;
    }

    /* HAMBURGER */

    .menu-icon {
      order: 3;

      display: flex;

      width: 42px;
      height: 42px;

      align-items: center;
      justify-content: center;

      font-size: 27px;

      flex-shrink: 0;
    }

    /* MOBILE MENU */

    .nav-menu {
      position: fixed;

      top: 80px;
      left: -100%;

      width: 100%;
      height: calc(100vh - 80px);

      background: #080808;

      display: flex;
      flex-direction: column;

      justify-content: center;
      align-items: center;

      gap: 35px;

      transition: left 0.4s ease;

      z-index: 998;
    }

    .nav-menu.active {
      left: 0;
    }

    .nav-menu .nav-links {
      display: flex;

      flex-direction: column;

      width: auto;

      gap: 25px;

      text-align: center;
    }

    .nav-menu .nav-links a {
      font-size: 20px;
    }

    /* MOBILE MENU BUTTONS */

    .nav-menu .nav-buttons {
      width: auto;

      display: flex;

      flex-direction: row;
    }

    /* HERO */

    .hero {
      padding-top: 110px;
    }
  }

  /* =========================================
   VERY SMALL SCREENS
========================================= */

  @media (max-width: 480px) {
    .navbar {
      height: 72px;

      padding: 0 12px;

      gap: 6px;
    }

    .logo {
      height: 72px;
    }

    .logo-image {
      width: 65px;
      height: 65px;
    }

    .nav-buttons {
      gap: 5px;
    }

    .gold-btn {
      padding: 8px 12px;

      font-size: 13px;

      border-radius: 9px;
    }

    .login-btn {
      padding: 8px;
      font-size: 13px;
    }

    .menu-icon {
      width: 38px;
      height: 38px;

      font-size: 25px;
    }

    .nav-menu {
      top: 72px;
      height: calc(100vh - 72px);
    }

    .hero {
      padding-top: 100px;
    }
  }

  /* =========================================
   DASHBOARD NAVBAR
========================================= */

  .main-area .navbar {
    left: 270px;
    right: 0;
    width: auto;
  }

  /* DASHBOARD MOBILE */

  @media (max-width: 1000px) {
    .main-area .navbar {
      left: 0;
      right: 0;
      width: 100%;
    }
  }
}




another file


import "./Sidebar.css";
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

        <Link
          to="/settings"
          onClick={closeSidebar}
          className={location.pathname === "/settings" ? "active" : ""}
        >
          <FiSettings />
          Settings
        </Link>
      </div>
      <div className="sidebar-profile">
        <button
          type="button"
          className="avatar-button"
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
            className="sidebar-avatar"
          />
          <span className="avatar-camera">+</span>
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


css:
.sidebar {
  position: fixed;

  left: 0;

  top: 0;

  width: 270px;

  height: 100vh;

  background: #0a0a0a;

  border-right: 1px solid #242424;

  padding: 30px 20px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  transition: 0.35s;

  z-index: 2000;
}

.logo-image {
  width: 160px;

  display: block;

  margin: 0 auto 22px;
}

.menu {
  display: flex;

  flex-direction: column;

  gap: 8px;
}

.menu a {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 14px 18px;

  border-radius: 14px;

  text-decoration: none;

  color: #a9a9a9;

  font-size: 15px;

  transition: 0.3s;
}

.menu a:hover {
  background: #171717;

  color: #d4af37;

  transform: translateX(6px);
}

.menu a.active {
  background: rgba(212, 175, 55, 0.12);

  color: #d4af37;

  border: 1px solid rgba(212, 175, 55, 0.25);
}

.logout-btn {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  padding: 14px;

  border: none;

  border-radius: 14px;

  background: #8b0000;

  color: white;

  cursor: pointer;

  font-weight: 600;

  transition: 0.3s;
}

.logout-btn:hover {
  background: #991b1bd1;
}

.close-sidebar {
  display: none;
}

@media (max-width: 1000px) {
  .sidebar {
    width: 270px;

    transform: translateX(-100%);

    box-shadow: 10px 0 40px rgba(0, 0, 0, 0.6);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .close-sidebar {
    display: flex;

    align-items: center;

    justify-content: center;

    width: 36px;

    height: 36px;

    align-self: flex-end;

    background: #151515;

    border: 1px solid #333;

    border-radius: 10px;

    color: white;

    font-size: 20px;

    cursor: pointer;

    margin-bottom: 15px;
  }
}
/* Sidebar Profile */

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 10px;

  margin-bottom: 18px;

  border-radius: 14px;

  text-decoration: none;

  background: #111;

  border: 1px solid #222;

  transition: 0.3s ease;
}

.sidebar-profile:hover {
  background: #171717;

  border-color: rgba(212, 175, 55, 0.35);

  transform: translateY(-2px);
}

/* Profile Image */

.sidebar-avatar {
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid #d4af37;

  background: #1a1a1a;
}

/* User Information */

.sidebar-user-info {
  display: flex;

  flex-direction: column;

  min-width: 0;
}

.sidebar-user-info strong {
  color: white;

  font-size: 14px;

  font-weight: 600;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.sidebar-user-info span {
  color: #777;

  font-size: 11px;

  margin-top: 3px;
}

.avatar-button {
  position: relative;

  width: 46px;
  height: 46px;

  padding: 0;

  border: none;

  background: none;

  cursor: pointer;

  flex-shrink: 0;
}

.avatar-button .sidebar-avatar {
  width: 46px;
  height: 46px;

  display: block;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid #d4af37;
}

.avatar-camera {
  position: absolute;

  right: -2px;
  bottom: -2px;

  width: 17px;
  height: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #d4af37;

  color: #050505;

  border-radius: 50%;

  font-size: 14px;

  font-weight: bold;

  border: 2px solid #111;
}

.avatar-button:hover .sidebar-avatar {
  filter: brightness(0.75);
}

.avatar-button:hover .avatar-camera {
  transform: scale(1.1);
}
