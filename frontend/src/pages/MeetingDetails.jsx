import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";
import MeetingInfo from "../components/MeetingInfo.jsx";
import AIAnalytics from "../components/AIAnalytics.jsx";

import {
  getMeetingById,
  generateMeetingSummary,
  askMeetingAI,
} from "../api/meeting.js";

import {
  FiArrowLeft,
  FiExternalLink,
  FiCpu,
  FiFileText,
  FiCheckCircle,
  FiBookmark,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";

import "./MeetingDetails.css";

function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingAI, setAskingAI] = useState(false);

  // ====
  // LOAD MEETING
  // ====

  const loadMeeting = async () => {
    try {
      const res = await getMeetingById(id);
      setMeeting(res.data);
    } catch (error) {
      console.error("GET MEETING ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load meeting");

      navigate("/meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeeting();
  }, [id]);

  // ====
  // GENERATE AI SUMMARY
  // ====

  const handleGenerateSummary = async () => {
    try {
      setGeneratingSummary(true);

      const res = await generateMeetingSummary(id);

      setMeeting(res.data);

      toast.success("AI analysis generated successfully");
    } catch (error) {
      console.error("AI SUMMARY ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to generate AI summary",
      );
    } finally {
      setGeneratingSummary(false);
    }
  };

  // ====
  // ASK AI
  // ====

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

      toast.error(error.response?.data?.message || "Failed to get AI answer");
    } finally {
      setAskingAI(false);
    }
  };

  if (loading) {
    return <LoadingScreen title="Meeting" />;
  }

  if (!meeting) {
    return null;
  }

  return (
    <MainLayout>
      <div className="meeting-workspace">
        {/* 
            TOP NAVIGATION
         */}

        <div className="workspace-topbar">
          <button
            className="back-meetings-btn"
            onClick={() => navigate("/meetings")}
          >
            <FiArrowLeft />
            Back to Meetings
          </button>

          {meeting.meetingUrl && (
            <a
              href={meeting.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="google-meet-btn"
            >
              <FiExternalLink />
              Open Google Meet
            </a>
          )}
        </div>

        {/* 
            MEETING HEADER / INFO
         */}

        <section className="workspace-section">
          <MeetingInfo meeting={meeting} />
        </section>

        {/* 
            AI ANALYTICS
         */}

        <section className="workspace-section">
          <AIAnalytics meeting={meeting} />
        </section>

        {/* 
            TRANSCRIPT
         */}

        <section className="workspace-card transcript-card">
          <div className="section-heading">
            <div className="section-icon">
              <FiFileText />
            </div>

            <div>
              <h2>Transcript</h2>
              <p>Meeting conversation and speech-to-text output.</p>
            </div>
          </div>

          {meeting.transcript ? (
            <div className="transcript-content">{meeting.transcript}</div>
          ) : (
            <div className="empty-section">
              <FiFileText />
              <p>No transcript available yet.</p>
            </div>
          )}
        </section>

        {/* 
            AI INSIGHTS
         */}

        <section className="workspace-card">
          <div className="section-heading">
            <div className="section-icon">
              <FiCpu />
            </div>

            <div>
              <h2>AI Meeting Intelligence</h2>
              <p>Turn your meeting information into useful insights.</p>
            </div>
          </div>

          <button
            className="generate-summary-btn"
            onClick={handleGenerateSummary}
            disabled={generatingSummary}
          >
            <FiCpu />

            {generatingSummary
              ? "Generating AI Analysis..."
              : meeting.summary
                ? "Regenerate AI Analysis"
                : "Generate AI Analysis"}
          </button>

          {meeting.summary && (
            <div className="ai-summary-box">
              <div className="insight-title">
                <FiFileText />
                <h3>Summary</h3>
              </div>

              <p>{meeting.summary}</p>
            </div>
          )}

          <div className="insights-grid">
            {/* KEY POINTS */}

            <div className="insight-card">
              <div className="insight-card-header">
                <FiBookmark />
                <h3>Key Points</h3>
              </div>

              {meeting.keyPoints?.length > 0 ? (
                <ul>
                  {meeting.keyPoints.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">No key points available.</p>
              )}
            </div>

            {/* ACTION ITEMS */}

            <div className="insight-card">
              <div className="insight-card-header">
                <FiCheckCircle />
                <h3>Action Items</h3>
              </div>

              {meeting.actionItems?.length > 0 ? (
                <ul>
                  {meeting.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">No action items available.</p>
              )}
            </div>

            {/* DECISIONS */}

            <div className="insight-card">
              <div className="insight-card-header">
                <FiBookmark />
                <h3>Decisions</h3>
              </div>

              {meeting.decisions?.length > 0 ? (
                <ul>
                  {meeting.decisions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">No decisions available.</p>
              )}
            </div>

            {/* DEADLINES */}

            <div className="insight-card">
              <div className="insight-card-header">
                <FiClock />
                <h3>Deadlines</h3>
              </div>

              {meeting.deadlines?.length > 0 ? (
                <ul>
                  {meeting.deadlines.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-text">No deadlines available.</p>
              )}
            </div>
          </div>
        </section>

        {/* 
            NOTES
         */}

        <section className="workspace-card">
          <div className="section-heading">
            <div className="section-icon">
              <FiFileText />
            </div>

            <div>
              <h2>Meeting Notes</h2>
              <p>Your notes used as part of the meeting context.</p>
            </div>
          </div>

          {meeting.notes ? (
            <div className="notes-content">{meeting.notes}</div>
          ) : (
            <div className="empty-section">
              <FiFileText />
              <p>No notes have been added yet.</p>
            </div>
          )}
        </section>

        {/* 
            ASK AI
         */}

        <section className="workspace-card ask-ai-card">
          <div className="section-heading">
            <div className="section-icon">
              <FiMessageCircle />
            </div>

            <div>
              <h2>Ask AI About This Meeting</h2>
              <p>
                Ask questions about the meeting, decisions, action items, or
                summary.
              </p>
            </div>
          </div>

          <form className="ask-ai-form" onSubmit={handleAskAI}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about this meeting..."
            />

            <button type="submit" disabled={askingAI}>
              <FiCpu />

              {askingAI ? "Thinking..." : "Ask AI"}
            </button>
          </form>

          {answer && (
            <div className="ai-answer">
              <strong>AI Answer</strong>
              <p>{answer}</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default MeetingDetails;
