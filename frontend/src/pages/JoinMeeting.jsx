import { useState } from "react";
import toast from "react-hot-toast";
import { FiVideo, FiExternalLink, FiMic, FiLink } from "react-icons/fi";

import { startMeetingBot } from "../api/meeting";

function JoinMeeting() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    const cleanUrl = meetingUrl.trim();

    // Check Google Meet URL
    if (!cleanUrl) {
      toast.error("Please enter a Google Meet link");
      return;
    }

    if (!cleanUrl.includes("meet.google.com")) {
      toast.error("Please enter a valid Google Meet link");
      return;
    }

    try {
      setLoading(true);

      console.log("🤖 Starting MeetMind AI...");
      console.log("Google Meet:", cleanUrl);

      const response = await startMeetingBot(cleanUrl);

      console.log("✅ Bot response:", response.data);

      if (response.data.success) {
        toast.success("MeetMind AI is joining!");

        // Open the actual Google Meet
        window.open(cleanUrl, "_blank");

        setMeetingUrl("");
      }
    } catch (error) {
      console.error(
        "❌ MeetMind Bot Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Could not start MeetMind AI",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-[#050505] px-5 py-10 sm:px-10">
      <div className="w-full max-w-[600px] rounded-[24px] border border-[#d4af37]/35 bg-[#101010] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-11">
        {/* Icon */}
        <div className="mb-5 flex h-[61px] w-[61px] items-center justify-center rounded-2xl bg-[#d4af37]/12 text-[28px] text-[#d4af37]">
          <FiVideo />
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-3xl font-semibold text-white">
          Join a Meeting
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-[#888] sm:text-base">
          Connect MeetMind AI to your Google Meet session.
        </p>

        <form onSubmit={handleJoinMeeting}>
          {/* Label */}
          <label className="mb-2 block text-sm font-medium text-[#ddd]">
            Google Meet Link
          </label>

          {/* Input */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#333] bg-[#080808] px-[18px] py-[15px] transition focus-within:border-[#d4af37] focus-within:shadow-[0_0_18px_rgba(212,175,55,0.15)]">
            <FiLink className="shrink-0 text-[#d4af37]" />

            <input
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              className="w-full border-none bg-transparent text-[15px] text-white outline-none placeholder:text-[#555]"
            />
          </div>

          {/* Join Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-[#d4af37] px-4 py-[15px] text-base font-semibold text-[#080808] transition duration-300 hover:bg-[#e1bd48] hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiVideo />

            {loading ? "Connecting..." : "Join Google Meet"}
          </button>
        </form>

        {/* AI Information */}
        <div className="mt-8 border-t border-[#222] pt-5">
          <div className="my-3 flex items-center gap-3 text-sm text-[#888]">
            <FiMic className="shrink-0 text-[#d4af37]" />
            <span>MeetMind AI joins the meeting</span>
          </div>

          <div className="my-3 flex items-center gap-3 text-sm text-[#888]">
            <FiVideo className="shrink-0 text-[#d4af37]" />
            <span>Meeting recording enabled</span>
          </div>

          <div className="my-3 flex items-center gap-3 text-sm text-[#888]">
            <FiExternalLink className="shrink-0 text-[#d4af37]" />
            <span>AI transcript generated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinMeeting;
