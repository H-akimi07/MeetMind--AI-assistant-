import toast from "react-hot-toast";

function MeetingInfo({ meeting }) {
  const copyCode = () => {
    navigator.clipboard.writeText(meeting.meetingCode);

    toast.success("Meeting code copied");
  };

  const statusStyles = {
    scheduled:
      "bg-[rgba(212,175,55,0.15)] text-[#d4af37] border-[rgba(212,175,55,0.4)]",

    live: "bg-[rgba(0,200,83,0.15)] text-[#00c853] border-[rgba(0,200,83,0.4)]",

    completed:
      "bg-[rgba(41,121,255,0.15)] text-[#2979ff] border-[rgba(41,121,255,0.4)]",

    cancelled:
      "bg-[rgba(229,57,53,0.15)] text-[#e53935] border-[rgba(229,57,53,0.4)]",
  };

  return (
    <div
      className="
        relative overflow-hidden
        bg-[linear-gradient(145deg,#111111,#1c1c1c)]
        border border-[rgba(212,175,55,0.35)]
        rounded-[24px]
        p-[35px]
        mb-[35px]
        text-white
        shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.12)]
        before:content-['']
        before:absolute
        before:w-[250px]
        before:h-[250px]
        before:right-[-100px]
        before:top-[-100px]
        before:bg-[rgba(212,175,55,0.15)]
        before:blur-[80px]
        max-[700px]:p-[25px]
      "
    >
      {/* TITLE */}

      <div
        className="
          relative z-[1]
          flex items-center justify-between
          gap-5
          mb-[25px]
          max-[700px]:flex-col
          max-[700px]:items-start
        "
      >
        <h1
          className="
            m-0
            text-white
            text-[32px]
            font-bold
            tracking-[0.5px]
            max-[700px]:text-[24px]
          "
        >
          {meeting.title}
        </h1>

        <span
          className={`
            py-2 px-[18px]
            rounded-[30px]
            text-[14px]
            font-bold
            capitalize
            border
            ${statusStyles[meeting.status] || ""}
          `}
        >
          {meeting.status}
        </span>
      </div>

      {/* DATE */}

      <p
        className="
          text-[16px]
          text-[#cccccc]
          my-[14px]
          flex items-center gap-2
        "
      >
        📅
        {new Date(meeting.scheduledAt).toLocaleDateString()}
      </p>

      {/* DURATION */}

      <p
        className="
          text-[16px]
          text-[#cccccc]
          my-[14px]
          flex items-center gap-2
        "
      >
        ⏱{meeting.duration} minutes
      </p>

      {/* ORGANIZER */}

      <p
        className="
          text-[16px]
          text-[#cccccc]
          my-[14px]
          flex items-center gap-2
        "
      >
        👤 Organizer:
        {meeting.organizer?.fullName || "Unknown"}
      </p>

      {/* PARTICIPANTS */}

      <p
        className="
          text-[16px]
          text-[#cccccc]
          my-[14px]
          flex items-center gap-2
        "
      >
        👥 Participants:
        {meeting.participants?.length || 0}
      </p>

      {/* MEETING CODE */}

      <div
        className="
          relative z-[2]
          mt-[25px]
          bg-[#080808]
          border border-[rgba(212,175,55,0.3)]
          rounded-[16px]
          py-[15px] px-5
          flex items-center justify-between
          font-mono
          text-[17px]
          text-[#d4af37]
          max-[700px]:flex-col
          max-[700px]:items-stretch
          max-[700px]:gap-[15px]
        "
      >
        <span>🔑 {meeting.meetingCode}</span>

        <button
          onClick={copyCode}
          className="
            bg-[linear-gradient(135deg,#d4af37,#b8860b)]
            border-0
            text-[#111]
            font-bold
            py-2 px-[18px]
            rounded-[12px]
            cursor-pointer
            transition-all duration-300
            hover:-translate-y-[3px]
            hover:shadow-[0_10px_25px_rgba(212,175,55,0.35)]
            max-[700px]:w-full
          "
        >
          📋 Copy
        </button>
      </div>
    </div>
  );
}

export default MeetingInfo;
