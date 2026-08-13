import { useState } from "react";
import { updateMeeting } from "../api/meeting";
import "./EditMeeting.css";
import toast from "react-hot-toast";

function EditMeeting({ meeting, close }) {
  const [form, setForm] = useState({
    title: meeting.title,

    description: meeting.description,

    scheduledAt: meeting.scheduledAt?.slice(0, 10),

    duration: meeting.duration || 60,

    status: meeting.status || "scheduled",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const save = async () => {
    console.log("Meeting ID:", meeting._id);
    console.log("Sending:", form);

    try {
      const res = await updateMeeting(meeting._id, form);

      console.log("Response:", res.data);

      toast.success("Meeting created successfully!");
      close();

      window.location.reload();
    } catch (error) {
      console.log(error);

      toast.error("Updating failed");
    }
  };

  return (
    <div className="edit-box">
      <h2>Edit Meeting</h2>

      <input name="title" value={form.title} onChange={handleChange} />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="date"
        name="scheduledAt"
        value={form.scheduledAt}
        onChange={handleChange}
      />

      <input
        type="number"
        name="duration"
        value={form.duration}
        onChange={handleChange}
      />

      <input
        type="number"
        name="duration"
        value={form.duration}
        onChange={handleChange}
      />

      <select
        className="status-select"
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="scheduled ">📅 Scheduled</option>

        <option value="live ">🟢 Live</option>

        <option value="completed ">✅ Completed</option>

        <option value="cancelled ">❌ Cancelled</option>
      </select>

      <button onClick={save} class="save-btn">
        Save Changes
      </button>

      <button onClick={close} class="cancel-btn">
        Cancel
      </button>
    </div>
  );
}

export default EditMeeting;
