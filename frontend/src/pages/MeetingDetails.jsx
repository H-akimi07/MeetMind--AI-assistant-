import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";
import { getMeetingById } from "../api/meeting.js";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiKey,
  FiExternalLink,
} from "react-icons/fi";

import "./MeetingDetails.css";

function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadMeeting();
  }, [id, navigate]);

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
        <button
          className="back-meetings-btn"
          onClick={() => navigate("/meetings")}
        >
          <FiArrowLeft />
          Back to Meetings
        </button>

        <div className="meeting-details-card">
          <div className="meeting-details-header">
            <div>
              <span className="meeting-details-label">Meeting Details</span>

              <h1>{meeting.title}</h1>

              <span className={`meeting-details-status ${meeting.status}`}>
                {meeting.status}
              </span>
            </div>
          </div>

          {meeting.description && (
            <div className="meeting-details-section">
              <h2>Description</h2>
              <p>{meeting.description}</p>
            </div>
          )}

          <div className="meeting-details-grid">
            <div className="meeting-detail-item">
              <FiCalendar />

              <div>
                <span>Date</span>
                <strong>{formattedDate}</strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <FiClock />

              <div>
                <span>Time</span>
                <strong>{formattedTime}</strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <FiClock />

              <div>
                <span>Duration</span>
                <strong>{meeting.duration || 60} minutes</strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <FiKey />

              <div>
                <span>Meeting Code</span>
                <strong>{meeting.meetingCode}</strong>
              </div>
            </div>
          </div>

          <div className="meeting-details-actions">
            {meeting.meetingUrl && (
              <a
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="join-google-meet-btn"
              >
                <FiExternalLink />
                Open Google Meet
              </a>
            )}

            <button className="back-btn" onClick={() => navigate("/meetings")}>
              Back to Meetings
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default MeetingDetails;
