import "./WelcomeBanner.css";
import { useNavigate } from "react-router-dom";

import { FiPlus, FiUsers, FiSettings } from "react-icons/fi";

function WelcomeBanner() {
  const navigate = useNavigate();

  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <h1>Welcome back</h1>

        <p>Your meetings are becoming smarter with AI.</p>
      </div>

      <div className="quick-actions">
        <button onClick={() => navigate("/create-meeting")}>
          <FiPlus />

          {/* <span>New Meeting</span> */}
        </button>

        <button onClick={() => navigate("/join-meeting")}>
          <FiUsers />

          {/* <span>Join Meeting</span> */}
        </button>

        <button onClick={() => navigate("/settings")}>
          <FiSettings />

          {/* <span>Settings</span> */}
        </button>
      </div>
    </div>
  );
}

export default WelcomeBanner;
