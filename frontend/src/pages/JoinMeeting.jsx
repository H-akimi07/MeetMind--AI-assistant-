import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiVideo,
  FiArrowLeft,
  FiExternalLink,
  FiMic,
  FiLink,
} from "react-icons/fi";

import { startMeetingBot } from "../api/meeting";
import "./JoinMeeting.css";
import "./MeetingDetails.css";

function JoinMeeting() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    const cleanUrl = meetingUrl.trim();

    // Check Google Meet URL
    if (!cleanUrl) {
      toast.error("Please enter a Google Meet link");
      return;
    }

    if (!cleanUrl.includes("meet.google.com")) {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    try {
      setLoading(true);

      console.log("🤖 Starting MeetMind AI...");
      console.log("Google Meet:", cleanUrl);

      const response = await startMeetingBot(cleanUrl);

      console.log("✅ Bot response:", response.data);

      if (response.data.success) {
        toast.success("MeetMind AI is joining!");

        // Open the actual Google Meet
        window.open(cleanUrl, "_blank");

        setMeetingUrl("");
      }
    } catch (error) {
      console.error(
        "❌ MeetMind Bot Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Could not start MeetMind AI",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-meeting-page">
      <div className="meeting-details-topbar">
        <button
          className="back-meetings-btn"
          onClick={() => navigate("/meetings")}
        >
          <FiArrowLeft />
          Back to Meetings
        </button>
      </div>
      <div className="join-meeting-card">
        <div className="join-icon">
          <FiVideo />
        </div>

        <h1>Join a Meeting</h1>

        <p>Connect MeetMind AI to your Google Meet session.</p>

        <form onSubmit={handleJoinMeeting}>
          <label>Google Meet Link</label>

          <div className="meeting-input">
            <FiLink />

            <input
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            <FiVideo />

            {loading ? "Connecting..." : "Join Google Meet"}
          </button>
        </form>

        <div className="ai-info">
          <div>
            <FiMic />
            <span>MeetMind AI joins the meeting</span>
          </div>

          <div>
            <FiVideo />
            <span>Meeting recording enabled</span>
          </div>

          <div>
            <FiExternalLink />
            <span>AI transcript generated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
