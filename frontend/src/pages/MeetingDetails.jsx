import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";
import Transcript from "../components/Transcript";

import {
  getMeetingById,
  updateMeetingNotes,
  generateMeetingSummary,
  askMeetingAI,
  startMeetingBot,
} from "../api/meeting.js";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiKey,
  FiExternalLink,
  FiFileText,
  FiCpu,
  FiCheckCircle,
  FiBookmark,
  FiAlertCircle,
  FiSend,
  FiUsers,
} from "react-icons/fi";

function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingAI, setAskingAI] = useState(false);

  const [startingBot, setStartingBot] = useState(false);

  useEffect(() => {
    loadMeeting();
  }, [id]);

  const loadMeeting = async () => {
    try {
      setLoading(true);

      const res = await getMeetingById(id);

      setMeeting(res.data);
      setNotes(res.data.notes || "");
    } catch (error) {
      console.error("GET MEETING ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load meeting");

      navigate("/meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);

      const res = await updateMeetingNotes(id, notes);

      setMeeting(res.data);

      toast.success("Notes saved successfully");
    } catch (error) {
      console.error("SAVE NOTES ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setGeneratingSummary(true);

      const res = await generateMeetingSummary(id);

      setMeeting(res.data);

      toast.success("AI summary generated");
    } catch (error) {
      console.error("SUMMARY ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to generate AI summary",
      );
    } finally {
      setGeneratingSummary(false);
    }
  };

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

      toast.error(error.response?.data?.message || "Failed to ask AI");
    } finally {
      setAskingAI(false);
    }
  };

  const handleStartBot = async () => {
    if (!meeting.meetingUrl) {
      toast.error("This meeting does not have a Google Meet URL.");
      return;
    }

    try {
      setStartingBot(true);

      await startMeetingBot(meeting.meetingUrl);

      toast.success("AI meeting bot started");

      await loadMeeting();
    } catch (error) {
      console.error("START BOT ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to start meeting bot",
      );
    } finally {
      setStartingBot(false);
    }
  };

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
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          box-border
          px-[15px] py-5 pb-10
          sm:px-6
          lg:px-8
        "
      >
        {/* TOP BAR */}
        <div className="mb-[18px]">
          <button
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-2
              border-none
              bg-transparent
              px-0 py-2
              font-semibold
              text-white
            "
            onClick={() => navigate("/meetings")}
          >
            <FiArrowLeft />
            Back to Meetings
          </button>
        </div>

        {/* HERO */}
        <section
          className="
            mb-[18px]
            rounded-[20px]
            border border-[rgba(255,255,255,0.08)]
            bg-[#212121ac]
            p-5
            sm:p-[26px]
          "
        >
          <div
            className="
              flex
              flex-col
              items-start
              justify-between
              gap-5
              lg:flex-row
            "
          >
            <div>
              <span
                className="
                  text-[11px]
                  font-bold
                  tracking-[1.5px]
                  opacity-55
                "
              >
                MEETING WORKSPACE
              </span>

              <h1
                className="
                  my-[7px]
                  text-[26px]
                  font-bold
                  leading-tight
                  sm:text-[32px]
                  lg:text-[40px]
                "
              >
                {meeting.title}
              </h1>

              {meeting.description && (
                <p
                  className="
                    m-0
                    max-w-[800px]
                    leading-[1.6]
                    opacity-70
                  "
                >
                  {meeting.description}
                </p>
              )}
            </div>

            <span
              className={`
                whitespace-nowrap
                rounded-full
                px-3 py-[7px]
                text-[12px]
                font-bold
                capitalize
                ${
                  meeting.status === "scheduled"
                    ? "bg-[rgba(249,194,85,0.12)]"
                    : ""
                }
                ${meeting.status === "live" ? "bg-[rgba(34,197,94,0.12)]" : ""}
                ${
                  meeting.status === "completed"
                    ? "bg-[rgba(168,85,247,0.12)]"
                    : ""
                }
                ${
                  meeting.status === "cancelled"
                    ? "bg-[rgba(239,68,68,0.12)]"
                    : ""
                }
              `}
            >
              {meeting.status}
            </span>
          </div>

          {/* META */}
          <div
            className="
              mt-[22px]
              flex flex-wrap gap-[10px]
            "
          >
            <span
              className="
                inline-flex items-center gap-[7px]
                rounded-[10px]
                bg-[rgba(255,255,255,0.045)]
                px-3 py-[9px]
                text-[13px]
              "
            >
              <FiCalendar />
              {formattedDate}
            </span>

            <span
              className="
                inline-flex items-center gap-[7px]
                rounded-[10px]
                bg-[rgba(255,255,255,0.045)]
                px-3 py-[9px]
                text-[13px]
              "
            >
              <FiClock />
              {formattedTime}
            </span>

            <span
              className="
                inline-flex items-center gap-[7px]
                rounded-[10px]
                bg-[rgba(255,255,255,0.045)]
                px-3 py-[9px]
                text-[13px]
              "
            >
              <FiClock />
              {meeting.duration || 60} min
            </span>

            <span
              className="
                inline-flex items-center gap-[7px]
                rounded-[10px]
                bg-[rgba(255,255,255,0.045)]
                px-3 py-[9px]
                text-[13px]
              "
            >
              <FiKey />
              {meeting.meetingCode}
            </span>

            <span
              className="
                inline-flex items-center gap-[7px]
                rounded-[10px]
                bg-[rgba(255,255,255,0.045)]
                px-3 py-[9px]
                text-[13px]
              "
            >
              <FiUsers />
              {meeting.participants?.length || 0} participants
            </span>
          </div>
        </section>

        {/* ACTIONS */}
        <section
          className="
            mb-[18px]
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >
          {meeting.meetingUrl && (
            <a
              href={meeting.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                w-full
                box-border
                cursor-pointer
                items-center
                gap-[14px]
                rounded-2xl
                border border-[rgba(255,255,255,0.08)]
                bg-[#111827]
                p-[17px]
                text-left
                text-inherit
                no-underline
                transition-all
                hover:border-[rgba(212,175,55,0.4)]
                hover:bg-[#151a25]
              "
            >
              <FiExternalLink className="shrink-0 text-[22px]" />

              <div className="flex flex-col gap-[3px]">
                <strong>Open Google Meet</strong>

                <span className="text-[12px] opacity-55">Join the meeting</span>
              </div>
            </a>
          )}

          {meeting.meetingUrl && (
            <button
              className="
                flex
                w-full
                box-border
                cursor-pointer
                items-center
                gap-[14px]
                rounded-2xl
                border border-[rgba(255,255,255,0.08)]
                bg-[#111827]
                p-[17px]
                text-left
                text-inherit
                transition-all
                hover:border-[rgba(212,175,55,0.4)]
                hover:bg-[#151a25]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              onClick={handleStartBot}
              disabled={startingBot}
            >
              <FiCpu className="shrink-0 text-[22px]" />

              <div className="flex flex-col gap-[3px]">
                <strong>
                  {startingBot ? "Starting AI Bot..." : "Start AI Notetaker"}
                </strong>

                <span className="text-[12px] opacity-55">
                  Let MeetMind capture the meeting
                </span>
              </div>
            </button>
          )}
        </section>

        {/* NOTES + TRANSCRIPT */}
        <section
          className="
            mb-[18px]
            grid
            grid-cols-1
            gap-[18px]
            lg:grid-cols-2
          "
        >
          <div
            className="
              overflow-hidden
              rounded-[18px]
              border border-[rgba(255,255,255,0.08)]
              bg-[#212121ac]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-[15px]
                border-b border-[rgba(255,255,255,0.07)]
                p-[18px_20px]
              "
            >
              <div className="flex items-center gap-3">
                <FiFileText className="text-xl" />

                <div>
                  <h2 className="m-0 text-base">Meeting Notes</h2>

                  <span className="mt-[3px] block text-[12px] opacity-55">
                    Your notes and preparation
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="
                  w-auto
                  cursor-pointer
                  rounded-[9px]
                  border-none
                  bg-[#d4af37]
                  px-[13px] py-2
                  font-semibold
                  text-black
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-[27%]
                "
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write meeting notes here..."
              className="
                box-border
                min-h-[230px]
                w-full
                resize-y
                border-none
                bg-transparent
                p-5
                font-inherit
                leading-[1.6]
                text-inherit
                outline-none
              "
            />
          </div>

          <Transcript meetingId={id} onUploaded={loadMeeting} />
        </section>

        {/* AI SUMMARY */}
        <section
          className="
            mb-[18px]
            overflow-hidden
            rounded-[18px]
            border border-[rgba(255,255,255,0.08)]
            bg-[#212121ac]
          "
        >
          <div
            className="
              flex
              flex-col
              items-start
              justify-between
              gap-5
              border-b border-[rgba(255,255,255,0.07)]
              p-5
              lg:flex-row
              lg:items-center
            "
          >
            <div className="flex items-center gap-3">
              <FiCpu className="text-xl" />

              <div>
                <h2 className="m-0 text-[18px]">AI Meeting Intelligence</h2>

                <span className="mt-1 block text-[12px] opacity-55">
                  Transform your meeting into actionable insights.
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="
                flex
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-[7px]
                rounded-[10px]
                border-none
                bg-[#d4af37]
                px-[15px] py-[10px]
                font-medium
                text-black
                disabled:cursor-not-allowed
                disabled:opacity-60
                lg:w-[35%]
              "
            >
              <FiCpu />

              {generatingSummary ? "Generating..." : "Generate AI Summary"}
            </button>
          </div>

          <div className="p-[22px] leading-[1.75]">
            {meeting.summary ? (
              <p className="m-0 whitespace-pre-wrap">{meeting.summary}</p>
            ) : (
              <div
                className="
                  flex
                  min-h-[190px]
                  flex-col
                  items-center
                  justify-center
                  p-5
                  text-center
                  opacity-60
                "
              >
                <FiCpu className="mb-[10px] text-[28px]" />

                <p className="mb-[5px] font-semibold">No AI summary yet.</p>

                <span className="text-[12px]">
                  Add notes or meeting content and generate an AI summary.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* INSIGHTS */}
        <section
          className="
            mb-[18px]
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <InsightCard
            icon={<FiBookmark />}
            title="Key Points"
            items={meeting.keyPoints}
            empty="No key points generated yet."
          />

          <InsightCard
            icon={<FiCheckCircle />}
            title="Action Items"
            items={meeting.actionItems}
            empty="No action items generated yet."
          />

          <InsightCard
            icon={<FiBookmark />}
            title="Decisions"
            items={meeting.decisions}
            empty="No decisions generated yet."
          />

          <InsightCard
            icon={<FiAlertCircle />}
            title="Deadlines"
            items={meeting.deadlines}
            empty="No deadlines generated yet."
          />
        </section>

        {/* ASK AI */}
        <section
          className="
            overflow-hidden
            rounded-[18px]
            border border-[rgba(255,255,255,0.08)]
            bg-[#212121ac]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              border-b border-[rgba(255,255,255,0.07)]
              p-[18px_20px]
            "
          >
            <FiCpu className="text-xl" />

            <div>
              <h2 className="m-0 text-base">Ask MeetMind AI</h2>

              <span className="mt-[3px] block text-[12px] opacity-55">
                Ask questions about this meeting.
              </span>
            </div>
          </div>

          <form
            className="
              flex
              flex-col
              gap-[10px]
              p-5
              sm:flex-row
            "
            onSubmit={handleAskAI}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What decisions were made?"
              className="
                min-w-0
                flex-1
                rounded-[10px]
                border border-[rgba(255,255,255,0.1)]
                bg-transparent
                px-[14px] py-3
                text-inherit
                outline-none
                transition-all
                focus:border-[#d4af37]
              "
            />

            <button
              type="submit"
              disabled={askingAI}
              className="
                flex
                min-h-[42px]
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-[7px]
                rounded-[10px]
                border-none
                bg-[#d4af37]
                px-[17px]
                font-medium
                text-black
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-[17%]
              "
            >
              <FiSend />

              {askingAI ? "Thinking..." : "Ask AI"}
            </button>
          </form>

          {answer && (
            <div
              className="
                mx-5
                mb-5
                rounded-xl
                bg-[rgba(255,255,255,0.045)]
                p-4
              "
            >
              <strong className="mb-[7px] block">MeetMind AI</strong>

              <p className="m-0 whitespace-pre-wrap leading-[1.6]">{answer}</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

/* Small reusable component */

function InsightCard({ icon, title, items = [], empty }) {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border border-[rgba(255,255,255,0.08)]
        bg-[#212121ac]
        p-[18px]
      "
    >
      <div
        className="
          mb-[15px]
          flex
          items-center
          gap-[11px]
        "
      >
        <div
          className="
            grid
            h-9
            w-9
            shrink-0
            place-items-center
            rounded-[10px]
            bg-[rgba(255,255,255,0.06)]
          "
        >
          {icon}
        </div>

        <div>
          <h3 className="m-0 text-[14px]">{title}</h3>

          <span className="text-[11px] opacity-50">
            {items?.length || 0} items
          </span>
        </div>
      </div>

      {items?.length > 0 ? (
        <ul className="m-0 pl-[18px]">
          {items.map((item, index) => (
            <li
              key={index}
              className="
                mb-[9px]
                text-[13px]
                leading-[1.5]
              "
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="
            text-[12px]
            leading-[1.5]
            opacity-50
          "
        >
          {empty}
        </div>
      )}
    </div>
  );
}

export default MeetingDetails;
