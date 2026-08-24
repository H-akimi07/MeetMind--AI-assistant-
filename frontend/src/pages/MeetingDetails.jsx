import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";
import Transcript from "../components/Transcript";
import MeetingFiles from "../components/MeetingFiles";
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
  const [chatMessages, setChatMessages] = useState([]);
  const [askingAI, setAskingAI] = useState(false);

  const chatEndRef = useRef(null);

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

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      toast.error("Please enter a question");
      return;
    }

    // Immediately add user's question to chat
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setAskingAI(true);

    try {
      const res = await askMeetingAI(id, trimmedQuestion);

      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        content: res.data.answer || "No answer received.",
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("ASK AI ERROR:", error.response?.data || error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "ai",
        content:
          error.response?.data?.message ||
          "I couldn't answer that question right now.",
      };

      setChatMessages((prev) => [...prev, errorMessage]);

      toast.error(error.response?.data?.message || "Failed to ask AI");
    } finally {
      setAskingAI(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages, askingAI]);

  const handleStartBot = async () => {
    if (!meeting.meetingUrl) {
      toast.error("This meeting does not have a Google Meet URL.");
      return;
    }

    try {
      setStartingBot(true);

      await startMeetingBot(meeting._id, meeting.meetingUrl);
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
          <Transcript meetingId={id} onUploaded={loadMeeting} />{" "}
        </section>

        {/* MEETING DOCUMENTS */}

        <MeetingFiles meeting={meeting} onUploaded={loadMeeting} />
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
                <span>Ask anything about this meeting.</span>
              </div>
            </div>
          </div>

          {/* CHAT */}

          <div className="ai-chat-container">
            {chatMessages.length === 0 ? (
              <div className="ai-chat-empty">
                <div className="ai-chat-empty-icon">
                  <FiCpu />
                </div>

                <h3>MeetMind AI Assistant</h3>

                <p>
                  Ask questions about the meeting, decisions, action items,
                  deadlines, or key points.
                </p>
              </div>
            ) : (
              <div className="ai-chat-messages">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${
                      message.role === "user" ? "user-message" : "ai-message"
                    }`}
                  >
                    <div className="chat-avatar">
                      {message.role === "user" ? "You" : <FiCpu />}
                    </div>

                    <div className="chat-bubble">
                      <span className="chat-name">
                        {message.role === "user" ? "You" : "MeetMind AI"}
                      </span>

                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}

                {askingAI && (
                  <div className="chat-message ai-message">
                    <div className="chat-avatar">
                      <FiCpu />
                    </div>

                    <div className="chat-bubble">
                      <span className="chat-name">MeetMind AI</span>

                      <div className="ai-thinking">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* INPUT */}

          <form className="ask-ai-form" onSubmit={handleAskAI}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about this meeting..."
              disabled={askingAI}
            />

            <button type="submit" disabled={askingAI || !question.trim()}>
              <FiSend />

              {askingAI ? "Thinking..." : "Ask AI"}
            </button>
          </form>
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
