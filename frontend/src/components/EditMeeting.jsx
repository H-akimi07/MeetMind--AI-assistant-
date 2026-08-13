import { useState } from "react";
import { updateMeeting } from "../api/meeting";
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
    <div className="mt-5 rounded-[15px] border border-[#d4af37] bg-transparent p-5">
      <h2 className="mb-[15px] text-[20px] font-bold text-[#d4af37]">
        Edit Meeting
      </h2>

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
        className="
          mt-[15px] w-full cursor-pointer appearance-none rounded-[14px]
          border border-[rgba(212,175,55,0.5)] bg-[#111]
          bg-[linear-gradient(45deg,transparent_50%,#d4af37_50%),linear-gradient(135deg,#d4af37_50%,transparent_50%)]
          bg-[position:calc(100%-20px)_55%,calc(100%-15px)_55%]
          bg-[size:6px_6px,6px_6px]
          bg-no-repeat
          px-4 py-[14px] text-[16px] font-semibold text-[#f5c542]
          outline-none transition-all duration-300
          hover:border-[#d4af37]
          hover:shadow-[0_0_15px_rgba(212,175,55,0.35)]
          focus:border-[#ffd700]
          focus:shadow-[0_0_20px_rgba(255,215,0,0.45)]
        "
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option value="scheduled ">📅 Scheduled</option>
        <option value="live ">🟢 Live</option>
        <option value="completed ">✅ Completed</option>
        <option value="cancelled ">❌ Cancelled</option>
      </select>

      <button onClick={save} className="my-[10px] bg-[#d4af37] text-white">
        Save Changes
      </button>

      <button onClick={close} className="bg-[#8b0000] text-white">
        Cancel
      </button>
    </div>
  );
}

export default EditMeeting;
