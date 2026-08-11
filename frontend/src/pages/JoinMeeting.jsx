import { useState } from "react";
import toast from "react-hot-toast";
import { FiVideo, FiExternalLink, FiMic, FiLink } from "react-icons/fi";

import { startMeetingBot } from "../api/meeting";
import "./JoinMeeting.css";

function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    // Check MeetMind Meeting ID
    if (!meetingId.trim()) {
      toast.error("Please enter your MeetMind Meeting ID");
      return;
    }

    // Check Google Meet URL
    if (!meetingUrl.trim()) {
      toast.error("Please enter a Google Meet link");
      return;
    }

    if (!meetingUrl.includes("meet.google.com")) {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    try {
      setLoading(true);

      console.log("🤖 Starting MeetMind AI...");
      console.log("Meeting ID:", meetingId);
      console.log("Google Meet:", meetingUrl);

      const response = await startMeetingBot(
        meetingId.trim(),
        meetingUrl.trim(),
      );

      console.log("✅ Bot response:", response.data);

      if (response.data.success) {
        toast.success("MeetMind AI is joining!");

        // Open Google Meet
        window.open(meetingUrl.trim(), "_blank");

        setMeetingId("");
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
      <div className="join-meeting-card">
        <div className="join-icon">
          <FiVideo />
        </div>

        <h1>Join a Meeting</h1>

        <p>Connect MeetMind AI to your Google Meet session.</p>

        <form onSubmit={handleJoinMeeting}>
          {/* MeetMind Meeting ID */}
          <label>MeetMind Meeting ID</label>

          <div className="meeting-input">
            <FiExternalLink />

            <input
              type="text"
              placeholder="Enter your MeetMind meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
            />
          </div>

          {/* Google Meet URL */}
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
