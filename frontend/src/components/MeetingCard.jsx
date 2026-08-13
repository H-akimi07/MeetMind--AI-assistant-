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

  const statusStyles = {
    live: "text-[#9fe3b0] bg-[rgba(76,175,80,0.08)] border-[rgba(76,175,80,0.18)] before:bg-[#4caf50] before:shadow-[0_0_7px_rgba(76,175,80,0.6)]",
    completed:
      "text-[#d4af37] bg-[rgba(212,175,55,0.07)] border-[rgba(212,175,55,0.18)] before:bg-[#d4af37]",
    scheduled:
      "text-[#9ca8ff] bg-[rgba(100,120,255,0.07)] border-[rgba(100,120,255,0.16)] before:bg-[#7180ff]",
    cancelled:
      "text-[#e53935] bg-[rgba(229,57,53,0.07)] border-[rgba(229,57,53,0.16)] before:bg-[#e53935]",
  };

  return (
    <div
      className="
        relative w-full box-border mt-[18px] p-[22px]
        bg-[#212121ac]
        border border-[rgba(255,255,255,0.075)]
        rounded-[18px]
        overflow-hidden
        backdrop-blur-[10px]
        transition-all duration-[250ms] ease
        hover:-translate-y-[3px]
        hover:border-[rgba(212,175,55,0.25)]
        hover:shadow-[0_14px_35px_rgba(0,0,0,0.35),0_0_25px_rgba(212,175,55,0.035)]
        before:content-['']
        before:absolute
        before:top-0
        before:left-[22px]
        before:right-[22px]
        before:h-[2px]
        before:bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.8),transparent)]
        before:opacity-[0.65]
        after:content-['']
        after:absolute
        after:top-[-90px]
        after:right-[-80px]
        after:w-[180px]
        after:h-[180px]
        after:bg-[rgba(212,175,55,0.035)]
        after:rounded-full
        after:pointer-events-none
      "
    >
      {/* HEADER */}

      <div
        className="
          relative z-[1]
          flex items-start justify-between
          gap-5
          max-[650px]:flex-col
          max-[650px]:gap-[13px]
        "
      >
        <div>
          <h3
            className="
              m-0 mb-[13px]
              text-white
              text-[18px]
              font-[650]
              leading-[1.35]
              tracking-[-0.2px]
              break-words
            "
          >
            {title}
          </h3>

          {/* INFORMATION */}

          <div
            className="
              flex items-center flex-wrap
              gap-x-[18px] gap-y-2
              max-[650px]:flex-col
              max-[650px]:items-start
              max-[650px]:gap-[7px]
            "
          >
            <p
              className="
                flex items-center gap-[7px]
                m-0
                text-[rgba(255,255,255,0.55)]
                text-[11px]
                leading-[1.4]
              "
            >
              <FiCalendar className="shrink-0 text-[#d4af37] text-[13px]" />

              {new Date(scheduledAt).toLocaleDateString()}
            </p>

            <p
              className="
                flex items-center gap-[7px]
                m-0
                text-[rgba(212,175,55,0.85)]
                text-[11px]
                leading-[1.4]
              "
            >
              <FiKey className="shrink-0 text-[#d4af37] text-[13px]" />
              Code: {meetingCode}
            </p>
          </div>
        </div>

        {/* STATUS */}

        <span
          className={`
            relative shrink-0
            inline-flex items-center gap-[6px]
            py-[6px] px-[10px]
            rounded-[20px]
            text-[9px]
            font-bold
            capitalize
            tracking-[0.2px]
            bg-[rgba(255,255,255,0.045)]
            border
            border-[rgba(255,255,255,0.08)]
            text-[rgba(255,255,255,0.65)]
            before:content-['']
            before:w-[5px]
            before:h-[5px]
            before:rounded-full
            before:bg-[#777]
            max-[650px]:self-start
            ${statusStyles[status] || ""}
          `}
        >
          {status}
        </span>
      </div>

      {/* BUTTONS */}

      <div
        className="
          relative z-[1]
          flex items-center
          gap-2
          w-full
          mt-5 pt-4
          border-t
          border-[rgba(255,255,255,0.055)]
          box-border
          max-[650px]:flex-wrap
          max-[380px]:flex-col
        "
      >
        {/* OPEN */}

        <button
          type="button"
          className="
            flex flex-1 items-center justify-center
            gap-[6px]
            h-[34px]
            px-3
            m-0
            rounded-lg
            text-[10px]
            font-[650]
            whitespace-nowrap
            cursor-pointer
            bg-[#d4af37]
            text-[#080808]
            border
            border-[#d4af37]
            transition-all duration-200
            hover:bg-[#e1bd48]
            hover:border-[#e1bd48]
            hover:-translate-y-px
            hover:shadow-[0_6px_16px_rgba(212,175,55,0.16)]
            max-[650px]:basis-full
          "
          onClick={() => {
            console.log("OPEN MEETING CLICKED");
            console.log("Meeting ID:", _id);

            navigate(`/meetings/${_id}`);
          }}
        >
          <FiExternalLink className="text-[13px]" />
          Open Meeting
        </button>

        {/* EDIT */}

        <button
          className="
            flex items-center justify-center
            gap-[6px]
            w-[30%]
            min-w-[72px]
            h-[34px]
            px-3
            m-0
            rounded-lg
            text-[10px]
            font-[650]
            whitespace-nowrap
            cursor-pointer
            bg-[rgba(255,255,255,0.035)]
            text-[rgba(255,255,255,0.72)]
            border
            border-[rgba(255,255,255,0.09)]
            transition-all duration-200
            hover:bg-[rgba(212,175,55,0.07)]
            hover:text-[#d4af37]
            hover:border-[rgba(212,175,55,0.25)]
            hover:-translate-y-px
            max-[650px]:flex-1
            max-[380px]:w-full
          "
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          <FiEdit3 className="text-[13px]" />
          Edit
        </button>

        {/* DELETE */}

        <button
          className="
            flex items-center justify-center
            gap-[6px]
            w-[30%]
            min-w-[72px]
            h-[34px]
            px-3
            m-0
            rounded-lg
            text-[10px]
            font-[650]
            whitespace-nowrap
            cursor-pointer
            bg-[rgba(139,0,0,0.12)]
            text-[#d66a6a]
            border
            border-[rgba(139,0,0,0.28)]
            transition-all duration-200
            hover:bg-[rgba(139,0,0,0.22)]
            hover:text-[#f08080]
            hover:border-[rgba(180,40,40,0.45)]
            hover:-translate-y-px
            max-[650px]:flex-1
            max-[380px]:w-full
          "
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <FiTrash2 className="text-[13px]" />
          Delete
        </button>
      </div>

      {/* EDIT MODAL */}

      {editing && (
        <EditMeeting meeting={meeting} close={() => setEditing(false)} />
      )}
    </div>
  );
}

export default MeetingCard;
