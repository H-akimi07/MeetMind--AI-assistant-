import { useState } from "react";
import { updateMeeting } from "../api/meeting";
import toast from "react-hot-toast";

import {
  FiEdit3,
  FiFileText,
  FiCalendar,
  FiClock,
  FiActivity,
  FiSave,
  FiX,
} from "react-icons/fi";

import "./EditMeeting.css";

function EditMeeting({ meeting, close, onChanged }) {
  const [form, setForm] = useState({
    title: meeting.title || "",
    description: meeting.description || "",
    scheduledAt: meeting.scheduledAt?.slice(0, 10) || "",
    duration: meeting.duration || 60,
    status: meeting.status || "scheduled",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Meeting title is required");
      return;
    }

    try {
      setSaving(true);

      const res = await updateMeeting(meeting._id, form);

      console.log("Updated meeting:", res.data);

      if (onChanged) {
        await onChanged();
      }

      toast.success("Meeting updated successfully!");

      close();
    } catch (error) {
      console.error("Update meeting error:", error);

      toast.error(error.response?.data?.message || "Failed to update meeting");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-box">
      {/* Header */}

      <div className="edit-header">
        <div className="edit-title-wrapper">
          <div className="edit-main-icon">
            <FiEdit3 />
          </div>

          <div>
            <h2>Edit Meeting</h2>

            <p>Update your meeting information</p>
          </div>
        </div>

        <button
          type="button"
          className="edit-close-btn"
          onClick={close}
          disabled={saving}
          aria-label="Close"
        >
          <FiX />
        </button>
      </div>

      {/* Form */}

      <div className="edit-form">
        {/* Title */}

        <div className="edit-field">
          <label>
            <FiFileText />
            Meeting Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter meeting title"
            disabled={saving}
          />
        </div>

        {/* Description */}

        <div className="edit-field">
          <label>
            <FiEdit3 />
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add a description for this meeting..."
            rows="4"
            disabled={saving}
          />
        </div>

        {/* Date + Duration */}

        <div className="edit-row">
          <div className="edit-field">
            <label>
              <FiCalendar />
              Scheduled Date
            </label>

            <input
              type="date"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="edit-field">
            <label>
              <FiClock />
              Duration
            </label>

            <div className="duration-input">
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min="1"
                disabled={saving}
              />

              <span>min</span>
            </div>
          </div>
        </div>

        {/* Status */}

        <div className="edit-field">
          <label>
            <FiActivity />
            Meeting Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="scheduled">Scheduled</option>

            <option value="live">Live</option>

            <option value="completed">Completed</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Actions */}

      <div className="edit-actions">
        <button
          type="button"
          className="edit-cancel-btn"
          onClick={close}
          disabled={saving}
        >
          <FiX />
          Cancel
        </button>

        <button
          type="button"
          className="edit-save-btn"
          onClick={save}
          disabled={saving}
        >
          <FiSave />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default EditMeeting;
