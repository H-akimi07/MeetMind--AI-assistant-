import "./LoadingScreen.css";
import { FiLoader } from "react-icons/fi";

function LoadingScreen({ title }) {
  return (
    <div className="loading-screen">
      <div className="loading-box">
        <FiLoader className="loading-icon" />

        <h2>Loading {title}...</h2>

        <p>Please wait a moment.</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
