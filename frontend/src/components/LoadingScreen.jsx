import "./LoadingScreen.css";
import { FiLoader, FiCpu } from "react-icons/fi";

function LoadingScreen({ title }) {
  return (
    <div className="loading-screen">
      <div className="loading-glow loading-glow-one"></div>
      <div className="loading-glow loading-glow-two"></div>

      <div className="loading-box">
        <div className="loading-icon-wrapper">
          <FiCpu className="loading-icon" />
        </div>

        <div className="loading-spinner-ring"></div>

        <h2>
          Loading <span>{title}</span>
        </h2>

        <p>Please wait a moment while MeetMind prepares everything.</p>

        <div className="loading-progress">
          <span></span>
        </div>

        <div className="loading-status">
          <FiLoader />
          <span>Processing securely...</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
