import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/meeting";
import toast from "react-hot-toast";

import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiEdit3,
  FiActivity,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";

import MainLayout from "../layouts/MainLayout.jsx";

import "./CreateMeeting.css";

function CreateMeeting() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    status: "scheduled",
  });

  const [creating, setCreating] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a meeting title");
      return;
    }

    if (!form.scheduledAt) {
      toast.error("Please select a meeting date and time");
      return;
    }

    try {
      setCreating(true);

      const scheduledAtUTC = new Date(form.scheduledAt).toISOString();

      const meetingData = {
        ...form,
        scheduledAt: scheduledAtUTC,
      };

      console.log("LOCAL TIME:", form.scheduledAt);
      console.log("UTC TIME SENT TO SERVER:", scheduledAtUTC);

      const res = await createMeeting(meetingData);

      console.log("CREATED MEETING:", res.data);

      toast.success("Meeting created successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error("CREATE MEETING ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to create meeting");
    } finally {
      setCreating(false);
    }
  };

  return (
    <MainLayout>
      <div className="create-meeting-page">
        <div className="create-meeting-card">
          {/* Header */}

          <div className="create-header">
            <div className="create-header-icon">
              <FiCalendar />
            </div>

            <div>
              <h1>Create New Meeting</h1>

              <p>Schedule and organize your next AI-powered meeting.</p>
            </div>
          </div>

          {/* Form */}

          <form onSubmit={handleCreate}>
            {/* Meeting Title */}

            <div className="create-field">
              <label>
                <FiFileText />
                Meeting Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Weekly Team Meeting"
                value={form.title}
                onChange={handleChange}
                required
              />

              <span className="field-hint">
                Give your meeting a clear and recognizable title.
              </span>
            </div>

            {/* Description */}

            <div className="create-field">
              <label>
                <FiEdit3 />
                Description
              </label>

              <textarea
                name="description"
                placeholder="Add a short description about this meeting..."
                value={form.description}
                onChange={handleChange}
                rows="4"
              />

              <span className="field-hint">
                Optional — add topics, goals or important context.
              </span>
            </div>

            {/* Date / Duration */}

            <div className="create-row">
              <div className="create-field">
                <label>
                  <FiCalendar />
                  Date & Time
                </label>

                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="create-field">
                <label>
                  <FiClock />
                  Duration
                </label>

                <div className="duration-wrapper">
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                  <span>min</span>
                </div>
              </div>
            </div>

            {/* Status */}

            <div className="create-field">
              <label>
                <FiActivity />
                Meeting Status
              </label>

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="scheduled">Scheduled</option>

                <option value="live">Live</option>

                <option value="completed">Completed</option>

                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Actions */}

            <div className="create-actions">
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/dashboard")}
                disabled={creating}
              >
                <FiArrowLeft />
                Cancel
              </button>

              <button className="create-btn" type="submit" disabled={creating}>
                <FiPlus />

                {creating ? "Creating..." : "Create Meeting"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CreateMeeting;
