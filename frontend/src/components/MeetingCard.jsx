import { useState } from "react";
import EditMeeting from "./EditMeeting";
import { deleteMeeting } from "../api/meeting.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiCalendar,
  FiKey,
  FiExternalLink,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";

import "./MeetingCard.css";

function MeetingCard({ meeting }) {
  const { _id, title, scheduledAt, status, meetingCode } = meeting;

  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting?",
    );

    if (!confirmDelete) return;

    try {
      await deleteMeeting(_id);

      toast.success("Meeting deleted");

      window.location.reload();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  return (
    <div className="meeting-card">
      <div className="meeting-card-header">
        <div>
          <h3>{title}</h3>

          <div className="meeting-info">
            <p>
              <FiCalendar />
              {new Date(scheduledAt).toLocaleDateString()}
            </p>

            <p className="meeting-code">
              <FiKey />
              Code: {meetingCode}
            </p>
          </div>
        </div>

        <span className={`meeting-status ${status}`}>{status}</span>
      </div>

      <div className="card-buttons">
        <button
          className="open-meeting-btn"
          onClick={() => navigate(`/meeting/${_id}`)}
        >
          <FiExternalLink />
          Open Meeting
        </button>

        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          <FiEdit3 />
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <FiTrash2 />
          Delete
        </button>
      </div>

      {editing && (
        <EditMeeting meeting={meeting} close={() => setEditing(false)} />
      )}
    </div>
  );
}

export default MeetingCard;
