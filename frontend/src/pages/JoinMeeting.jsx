import { useState } from "react";
import toast from "react-hot-toast";
import { FiVideo, FiExternalLink, FiMic, FiLink } from "react-icons/fi";

import { startMeetingBot } from "../api/meeting";
import "./JoinMeeting.css";

function JoinMeeting() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    const cleanUrl = meetingUrl.trim();

    // VALIDATE INPUT

    if (!cleanUrl) {
      toast.error("Please enter a Google Meet link");
      return;
    }

    // More reliable Google Meet validation
    let parsedUrl;

    try {
      parsedUrl = new URL(cleanUrl);
    } catch {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "meet.google.com"
    ) {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    // Make sure there is actually a meeting code
    const meetingCode = parsedUrl.pathname.split("/").filter(Boolean)[0];

    if (!meetingCode) {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    // Normalize URL
    const normalizedUrl = `https://meet.google.com/${meetingCode}`;

    try {
      setLoading(true);

      console.log("=================================");
      console.log("🤖 Starting MeetMind AI...");
      console.log("🔗 Google Meet:", normalizedUrl);
      console.log("🔑 Meeting Code:", meetingCode);
      console.log("=================================");

      /*
       * IMPORTANT
       *
       * Send an OBJECT to the API.
       *
       * The backend expects:
       *
       * {
       *   meetingUrl: "https://meet.google.com/..."
       * }
       *
       * Do NOT call:
       *
       * startMeetingBot(cleanUrl)
       *
       * because that can cause the API helper to put the
       * URL in the wrong property.
       */

      const response = await startMeetingBot({
        meetingUrl: normalizedUrl,
      });

      console.log("✅ Bot response:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Could not start MeetMind AI",
        );
      }

      toast.success("MeetMind AI is joining the meeting!");

      /*
       * Open Google Meet after the bot has been successfully
       * sent to Nylas.
       */

      window.open(normalizedUrl, "_blank", "noopener,noreferrer");

      setMeetingUrl("");
    } catch (error) {
      console.error(
        "❌ MeetMind Bot Error:",
        error.response?.data || error.message,
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Could not start MeetMind AI";

      toast.error(message);
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
          <label htmlFor="meeting-url">Google Meet Link</label>

          <div className="meeting-input">
            <FiLink />

            <input
              id="meeting-url"
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              disabled={loading}
              autoComplete="off"
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
