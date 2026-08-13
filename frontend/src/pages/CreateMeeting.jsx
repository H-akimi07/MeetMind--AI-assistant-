import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/meeting";
import toast from "react-hot-toast";

function CreateMeeting() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    status: "scheduled",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const res = await createMeeting(form);

      console.log(res.data);

      toast.success("Meeting created successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error("CREATE MEETING ERROR:", error);

      console.error("SERVER MESSAGE:", error.response?.data?.message);

      toast.error(error.response?.data?.message || "Failed to create meeting");
    }
  };

  const inputClass = `
    mb-5 w-full rounded-xl
    border border-[#333]
    bg-[#0b0b0b]
    px-[15px] py-[15px]
    text-[16px] text-white
    outline-none
    placeholder:text-[#666]
    transition
    focus:border-[#d4af37]
    focus:shadow-[0_0_15px_rgba(212,175,55,0.12)]
  `;

  return (
    <div className="my-[30px] flex min-h-[70vh] items-center justify-center px-5">
      <div
        className="
          w-[400px] max-w-full
          rounded-[25px]
          border border-[rgba(212,175,55,0.25)]
          bg-gradient-to-br from-[#111] to-[#050505]
          p-[50px]
          shadow-[0_0_40px_rgba(212,175,55,0.15)]
          max-sm:p-[30px]
        "
      >
        <h1 className="mb-[30px] text-center text-[28px] font-bold text-[#d4af37]">
          Create New Meeting
        </h1>

        <form onSubmit={handleCreate}>
          <input
            type="text"
            name="title"
            placeholder="Meeting title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <textarea
            name="description"
            placeholder="Meeting description"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} min-h-[110px] resize-y`}
          />

          <input
            type="datetime-local"
            name="scheduledAt"
            value={form.scheduledAt}
            onChange={handleChange}
            required
            className={inputClass}
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={handleChange}
            className={inputClass}
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={`
              ${inputClass}
              cursor-pointer
              appearance-none
            `}
          >
            <option value="scheduled" className="bg-[#050505]">
              Scheduled
            </option>

            <option value="live" className="bg-[#050505]">
              Live
            </option>

            <option value="completed" className="bg-[#050505]">
              Completed
            </option>

            <option value="cancelled" className="bg-[#050505]">
              Cancelled
            </option>
          </select>

          <button
            className="
              w-full rounded-xl
              bg-[#d4af37]
              p-[15px]
              font-bold text-black
              transition-all duration-300
              hover:scale-[1.02]
              hover:bg-[#e1bd48]
              hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)]
            "
          >
            Create Meeting
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMeeting;
