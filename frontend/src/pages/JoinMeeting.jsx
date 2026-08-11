import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiVideo, FiExternalLink, FiMic } from "react-icons/fi";

import "./JoinMeeting.css";

function JoinMeeting() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinMeeting = async (e) => {
    e.preventDefault();

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

      const response = await axios.post(
        "https://meetmind-ai-assistant.onrender.com/api/meeting-bot/join",
        {
          meetingUrl,
        },
      );

      if (response.data.success) {
        toast.success("MeetMind AI is joining!");

        // Open the actual Google Meet
        window.open(meetingUrl, "_blank");

        setMeetingUrl("");
      }
    } catch (error) {
      console.error(error);

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
          <label>Google Meet Link</label>

          <div className="meeting-input">
            <FiExternalLink />

            <input
              type="text"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
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
