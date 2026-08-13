import { FiCpu, FiZap, FiBookmark, FiClock } from "react-icons/fi";

function AIAnalytics({ meetings = [] }) {
  const totalSummaries = meetings.filter(
    (m) => m.summary && m.summary.length > 0,
  ).length;

  const totalActions = meetings.reduce(
    (total, m) => total + (m.actionItems?.length || 0),
    0,
  );

  const totalDecisions = meetings.reduce(
    (total, m) => total + (m.decisions?.length || 0),
    0,
  );

  const totalDeadlines = meetings.reduce(
    (total, m) => total + (m.deadlines?.length || 0),
    0,
  );

  return (
    <div className="mt-[30px] rounded-[20px] border border-[rgba(212,175,55,0.25)] bg-[linear-gradient(145deg,#111,#1b1b1b)] p-6 text-white">
      <h2 className="mb-5 flex items-center gap-[9px] text-[20px] text-[#d4af37]">
        <FiCpu className="text-[22px]" />
        AI Productivity
      </h2>

      <div className="grid grid-cols-1 gap-[14px] min-[501px]:grid-cols-2 min-[901px]:grid-cols-4">
        <div className="group flex items-center gap-[14px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#151515] p-4 transition duration-300 ease-in-out hover:-translate-y-[3px] hover:border-[rgba(212,175,55,0.5)]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(212,175,55,0.08)] text-[20px] text-[#d4af37]">
            <FiCpu />
          </div>

          <div>
            <p className="mb-1 text-[12px] text-[#888]">AI Summaries</p>

            <strong className="text-[22px] text-white">{totalSummaries}</strong>
          </div>
        </div>

        <div className="group flex items-center gap-[14px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#151515] p-4 transition duration-300 ease-in-out hover:-translate-y-[3px] hover:border-[rgba(212,175,55,0.5)]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(212,175,55,0.08)] text-[20px] text-[#d4af37]">
            <FiZap />
          </div>

          <div>
            <p className="mb-1 text-[12px] text-[#888]">Action Items</p>

            <strong className="text-[22px] text-white">{totalActions}</strong>
          </div>
        </div>

        <div className="group flex items-center gap-[14px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#151515] p-4 transition duration-300 ease-in-out hover:-translate-y-[3px] hover:border-[rgba(212,175,55,0.5)]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(212,175,55,0.08)] text-[20px] text-[#d4af37]">
            <FiBookmark />
          </div>

          <div>
            <p className="mb-1 text-[12px] text-[#888]">Decisions</p>

            <strong className="text-[22px] text-white">{totalDecisions}</strong>
          </div>
        </div>

        <div className="group flex items-center gap-[14px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#151515] p-4 transition duration-300 ease-in-out hover:-translate-y-[3px] hover:border-[rgba(212,175,55,0.5)]">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(212,175,55,0.08)] text-[20px] text-[#d4af37]">
            <FiClock />
          </div>

          <div>
            <p className="mb-1 text-[12px] text-[#888]">Deadlines</p>

            <strong className="text-[22px] text-white">{totalDeadlines}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAnalytics;
