import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useMemo } from "react";
import { FiCalendar, FiCheckCircle, FiCpu } from "react-icons/fi";
import { getProfile } from "../api/user";
import { getMyMeetings } from "../api/meeting";

import "./Topbar.css";

function Topbar() {
  const [user, setUser] = useState(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        setUser(res.data);
      } catch (error) {
        console.log("TOPBAR PROFILE ERROR:", error);
      }
    };

    loadProfile();

    const loadNotifications = async () => {
      try {
        const res = await getMyMeetings();

        const now = new Date();

        const upcoming = res.data.filter((meeting) => {
          const meetingTime = new Date(meeting.scheduledAt);

          const diff = (meetingTime - now) / 1000 / 60;

          return diff > 0 && diff <= 15;
        });

        setNotifications(upcoming);
      } catch (error) {
        console.log(error);
      }
    };

    loadNotifications();
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);

  //   const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="topbar">
      <div>
        <h2>Welcome Back{user?.name ? `, ${user.name}` : ""}</h2>

        <p>Manage your meetings smarter with AI.</p>
      </div>

      <div className="topbar-right">
        <div className="notification-wrapper">
          <button
            className="notification"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />

            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-title">
                <FiBell />
                <span>Notifications</span>
              </div>

              {notifications.length === 0 ? (
                <p className="empty-notification">No new notifications</p>
              ) : (
                notifications.map((meeting) => (
                  <div className="notification-item" key={meeting._id}>
                    <FiCalendar />

                    <div>
                      <strong>{meeting.title}</strong>

                      <p>
                        Starts at{" "}
                        {new Date(meeting.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}

              <div className="notification-item">
                <div className="notification-icon ai">
                  <FiCpu />
                </div>

                <div>
                  <h4>AI Summary Ready</h4>
                  <p>Team Meeting summary has been generated.</p>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon success">
                  <FiCheckCircle />
                </div>

                <div>
                  <h4>Workshop Reminder</h4>
                  <p>Starts in 10 minutes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/profile">
          <FaUserCircle className="avatar" />
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
