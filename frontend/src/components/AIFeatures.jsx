import {
  FiFileText,
  FiMic,
  FiCalendar,
  FiUsers,
  FiShield,
  FiSearch,
  FiGlobe,
  FiCpu,
} from "react-icons/fi";

const features = [
  {
    icon: <FiFileText />,
    title: "Smart Notes",
    text: "Automatically capture every important detail from your meetings.",
  },
  {
    icon: <FiCpu />,
    title: "AI Summaries",
    text: "Receive clear summaries and key takeaways in seconds.",
  },
  {
    icon: <FiGlobe />,
    title: "Live Translation",
    text: "Break language barriers with real-time translation.",
  },
  {
    icon: <FiMic />,
    title: "Voice Recognition",
    text: "Accurate speech-to-text powered by advanced AI.",
  },
  {
    icon: <FiCalendar />,
    title: "Smart Scheduling",
    text: "Plan meetings intelligently with AI suggestions.",
  },
  {
    icon: <FiUsers />,
    title: "Team Collaboration",
    text: "Share notes, assign tasks, and keep everyone aligned.",
  },
  {
    icon: <FiShield />,
    title: "Secure Meetings",
    text: "Enterprise-grade encryption keeps your conversations private.",
  },
  {
    icon: <FiSearch />,
    title: "AI Search",
    text: "Find any discussion or decision instantly using natural language.",
  },
];

function AIFeatures() {
  return (
    <section
      className="
        relative overflow-hidden bg-[#050505]
        px-[25px] py-[90px]
        min-[769px]:px-[8%] min-[769px]:py-[120px]

        before:pointer-events-none
        before:absolute before:inset-0 before:content-['']
        before:bg-[radial-gradient(circle_at_15%_25%,rgba(212,175,55,0.1),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(212,175,55,0.08),transparent_25%)]
      "
    >
      <div
        className="
          relative mx-auto mb-[70px] max-w-[760px] text-center
        "
      >
        <span className="text-[13px] font-semibold tracking-[3px] text-[#d4af37]">
          POWERFUL FEATURES
        </span>

        <h2 className="my-5 text-[36px] leading-[1.2] text-white min-[769px]:text-[52px]">
          Everything Your{" "}
          <span className="text-[#d4af37]">AI Meeting Assistant</span> Needs
        </h2>

        <p className="text-[16px] leading-[1.8] text-[#9b9b9b] min-[769px]:text-[18px]">
          MeetMind transforms conversations into actionable insights with
          intelligent automation before, during, and after every meeting.
        </p>
      </div>

      <div
        className="
          relative grid gap-7
          [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]
        "
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="
              group relative overflow-hidden rounded-[24px]
              border border-[rgba(212,175,55,0.15)]
              bg-[rgba(18,18,18,0.75)]
              p-[35px]
              backdrop-blur-[18px]
              transition duration-[400ms]

              before:pointer-events-none
              before:absolute before:inset-0 before:content-['']
              before:bg-[linear-gradient(135deg,transparent,rgba(212,175,55,0.06),transparent)]
              before:opacity-0
              before:transition-opacity before:duration-[400ms]

              hover:-translate-y-3
              hover:border-[#d4af37]
              hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)]
              hover:before:opacity-100
            "
          >
            <div
              className="
                mb-[25px] flex h-[70px] w-[70px]
                items-center justify-center
                rounded-[18px]
                border border-[rgba(212,175,55,0.2)]
                bg-[rgba(212,175,55,0.08)]
                text-[30px] text-[#d4af37]
              "
            >
              {feature.icon}
            </div>

            <h3 className="mb-[15px] text-[23px] text-white">
              {feature.title}
            </h3>

            <p className="text-[15px] leading-[1.8] text-[#9d9d9d]">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AIFeatures;
