import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";
import {
  getMeetingById,
  updateMeetingNotes,
  generateMeetingSummary,
  askMeetingAI,
  startMeetingBot,
} from "../api/meeting.js";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiKey,
  FiExternalLink,
  FiFileText,
  FiCpu,
  FiCheckCircle,
  FiBookmark,
  FiAlertCircle,
  FiMic,
  FiSend,
  FiUsers,
} from "react-icons/fi";

import "./MeetingDetails.css";

function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingAI, setAskingAI] = useState(false);

  const [startingBot, setStartingBot] = useState(false);

  useEffect(() => {
    loadMeeting();
  }, [id]);

  const loadMeeting = async () => {
    try {
      setLoading(true);

      const res = await getMeetingById(id);

      setMeeting(res.data);
      setNotes(res.data.notes || "");
    } catch (error) {
      console.error("GET MEETING ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load meeting");

      navigate("/meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);

      const res = await updateMeetingNotes(id, notes);

      setMeeting(res.data);

      toast.success("Notes saved successfully");
    } catch (error) {
      console.error("SAVE NOTES ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setGeneratingSummary(true);

      const res = await generateMeetingSummary(id);

      setMeeting(res.data);

      toast.success("AI summary generated");
    } catch (error) {
      console.error("SUMMARY ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to generate AI summary",
      );
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleAskAI = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      setAskingAI(true);
      setAnswer("");

      const res = await askMeetingAI(id, question);

      setAnswer(res.data.answer || "No answer received.");
    } catch (error) {
      console.error("ASK AI ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to ask AI");
    } finally {
      setAskingAI(false);
    }
  };

  const handleStartBot = async () => {
    if (!meeting.meetingUrl) {
      toast.error("This meeting does not have a Google Meet URL.");
      return;
    }

    try {
      setStartingBot(true);

      await startMeetingBot(meeting.meetingUrl);

      toast.success("AI meeting bot started");

      await loadMeeting();
    } catch (error) {
      console.error("START BOT ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to start meeting bot",
      );
    } finally {
      setStartingBot(false);
    }
  };

  if (loading) {
    return <LoadingScreen title="Meeting" />;
  }

  if (!meeting) {
    return null;
  }

  const formattedDate = new Date(meeting.scheduledAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const formattedTime = new Date(meeting.scheduledAt).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <MainLayout>
      <div className="meeting-details-page">
        {/* TOP BAR */}

        <div className="meeting-details-topbar">
          <button
            className="back-meetings-btn"
            onClick={() => navigate("/meetings")}
          >
            <FiArrowLeft />
            Back to Meetings
          </button>
        </div>

        {/* HEADER */}

        <section className="meeting-hero-card">
          <div className="meeting-hero-content">
            <div>
              <span className="meeting-details-label">MEETING WORKSPACE</span>

              <h1>{meeting.title}</h1>

              {meeting.description && (
                <p className="meeting-description">{meeting.description}</p>
              )}
            </div>

            <span className={`meeting-details-status ${meeting.status}`}>
              {meeting.status}
            </span>
          </div>

          <div className="meeting-meta-row">
            <span>
              <FiCalendar />
              {formattedDate}
            </span>

            <span>
              <FiClock />
              {formattedTime}
            </span>

            <span>
              <FiClock />
              {meeting.duration || 60} min
            </span>

            <span>
              <FiKey />
              {meeting.meetingCode}
            </span>

            <span>
              <FiUsers />
              {meeting.participants?.length || 0} participants
            </span>
          </div>
        </section>

        {/* MEETING ACTIONS */}

        <section className="meeting-action-grid">
          {meeting.meetingUrl && (
            <a
              href={meeting.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="meeting-action-card"
            >
              <FiExternalLink />

              <div>
                <strong>Open Google Meet</strong>
                <span>Join the meeting</span>
              </div>
            </a>
          )}

          {meeting.meetingUrl && (
            <button
              className="meeting-action-card"
              onClick={handleStartBot}
              disabled={startingBot}
            >
              <FiCpu />

              <div>
                <strong>
                  {startingBot ? "Starting AI Bot..." : "Start AI Notetaker"}
                </strong>

                <span>Let MeetMind capture the meeting</span>
              </div>
            </button>
          )}
        </section>

        {/* NOTES + TRANSCRIPT */}

        <section className="meeting-content-grid">
          <div className="meeting-panel">
            <div className="meeting-panel-header">
              <div>
                <FiFileText />

                <div>
                  <h2>Meeting Notes</h2>
                  <span>Your notes and preparation</span>
                </div>
              </div>

              <button onClick={handleSaveNotes} disabled={savingNotes}>
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write meeting notes here..."
            />
          </div>

          <div className="meeting-panel">
            <div className="meeting-panel-header">
              <div>
                <FiMic />

                <div>
                  <h2>Transcript</h2>
                  <span>Captured meeting conversation</span>
                </div>
              </div>
            </div>

            <div className="transcript-box">
              {meeting.transcript ? (
                <p>{meeting.transcript}</p>
              ) : (
                <div className="empty-content">
                  <FiMic />

                  <p>No transcript available yet.</p>

                  <span>Start the AI notetaker to capture the meeting.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AI SUMMARY */}

        <section className="ai-summary-panel">
          <div className="ai-summary-header">
            <div>
              <FiCpu />

              <div>
                <h2>AI Meeting Intelligence</h2>

                <span>Transform your meeting into actionable insights.</span>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
            >
              <FiCpu />

              {generatingSummary ? "Generating..." : "Generate AI Summary"}
            </button>
          </div>

          <div className="summary-content">
            {meeting.summary ? (
              <p>{meeting.summary}</p>
            ) : (
              <div className="empty-content">
                <FiCpu />

                <p>No AI summary yet.</p>

                <span>
                  Add notes or meeting content and generate an AI summary.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* AI INSIGHTS */}

        <section className="insights-grid">
          <InsightCard
            icon={<FiBookmark />}
            title="Key Points"
            items={meeting.keyPoints}
            empty="No key points generated yet."
          />

          <InsightCard
            icon={<FiCheckCircle />}
            title="Action Items"
            items={meeting.actionItems}
            empty="No action items generated yet."
          />

          <InsightCard
            icon={<FiBookmark />}
            title="Decisions"
            items={meeting.decisions}
            empty="No decisions generated yet."
          />

          <InsightCard
            icon={<FiAlertCircle />}
            title="Deadlines"
            items={meeting.deadlines}
            empty="No deadlines generated yet."
          />
        </section>

        {/* ASK AI */}

        <section className="ask-ai-panel">
          <div className="meeting-panel-header">
            <div>
              <FiCpu />

              <div>
                <h2>Ask MeetMind AI</h2>

                <span>Ask questions about this meeting.</span>
              </div>
            </div>
          </div>

          <form className="ask-ai-form" onSubmit={handleAskAI}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What decisions were made?"
            />

            <button type="submit" disabled={askingAI}>
              <FiSend />

              {askingAI ? "Thinking..." : "Ask AI"}
            </button>
          </form>

          {answer && (
            <div className="ai-answer">
              <strong>MeetMind AI</strong>
              <p>{answer}</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

/* Small reusable component */

function InsightCard({ icon, title, items = [], empty }) {
  return (
    <div className="insight-card">
      <div className="insight-card-header">
        <div className="insight-icon">{icon}</div>

        <div>
          <h3>{title}</h3>

          <span>{items?.length || 0} items</span>
        </div>
      </div>

      {items?.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="insight-empty">{empty}</div>
      )}
    </div>
  );
}

export default MeetingDetails;
