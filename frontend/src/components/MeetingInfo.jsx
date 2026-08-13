import "./MeetingInfo.css";
import toast from "react-hot-toast";

function MeetingInfo({ meeting }) {
  const copyCode = () => {
    navigator.clipboard.writeText(meeting.meetingCode);

    toast.success("Meeting code copied");
  };

  return (
    <div className="meeting-info-card">
      <div className="meeting-title-row">
        <h1>{meeting.title}</h1>

        <span className={`status ${meeting.status}`}>{meeting.status}</span>
      </div>

      <p>
        📅
        {new Date(meeting.scheduledAt).toLocaleDateString()}
      </p>

      <p>⏱{meeting.duration} minutes</p>

      <p>
        👤 Organizer:
        {meeting.organizer?.fullName || "Unknown"}
      </p>

      <p>
        👥 Participants:
        {meeting.participants?.length || 0}
      </p>

      <div className="meeting-code">
        🔑 {meeting.meetingCode}
        <button onClick={copyCode}>📋 Copy</button>
      </div>
    </div>
  );
}

export default MeetingInfo;
