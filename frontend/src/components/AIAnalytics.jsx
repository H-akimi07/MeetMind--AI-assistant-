// import "./AIAnalytics.css";

// import { FiCpu, FiZap, FiBookmark, FiClock } from "react-icons/fi";

// function AIAnalytics({ meetings = [] }) {
//   const totalSummaries = meetings.filter(
//     (m) => m.summary && m.summary.length > 0,
//   ).length;

//   const totalActions = meetings.reduce(
//     (total, m) => total + (m.actionItems?.length || 0),
//     0,
//   );

//   const totalDecisions = meetings.reduce(
//     (total, m) => total + (m.decisions?.length || 0),
//     0,
//   );

//   const totalDeadlines = meetings.reduce(
//     (total, m) => total + (m.deadlines?.length || 0),
//     0,
//   );

//   return (
//     <div className="ai-analytics">
//       <h2>
//         <FiCpu />
//         AI Productivity
//       </h2>

//       <div className="ai-stats">
//         <div className="ai-stat-card">
//           <div className="ai-stat-icon">
//             <FiCpu />
//           </div>

//           <div>
//             <p>AI Summaries</p>

//             <strong>{totalSummaries}</strong>
//           </div>
//         </div>

//         <div className="ai-stat-card">
//           <div className="ai-stat-icon">
//             <FiZap />
//           </div>

//           <div>
//             <p>Action Items</p>

//             <strong>{totalActions}</strong>
//           </div>
//         </div>

//         <div className="ai-stat-card">
//           <div className="ai-stat-icon">
//             <FiBookmark />
//           </div>

//           <div>
//             <p>Decisions</p>

//             <strong>{totalDecisions}</strong>
//           </div>
//         </div>

//         <div className="ai-stat-card">
//           <div className="ai-stat-icon">
//             <FiClock />
//           </div>

//           <div>
//             <p>Deadlines</p>

//             <strong>{totalDeadlines}</strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AIAnalytics;
import "./AIAnalytics.css";

import {
  FiCpu,
  FiZap,
  FiBookmark,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

function AIAnalytics({ meeting }) {
  if (!meeting) return null;

  const hasSummary = meeting.summary && meeting.summary.trim().length > 0;

  const totalActions = meeting.actionItems?.length || 0;
  const totalDecisions = meeting.decisions?.length || 0;
  const totalDeadlines = meeting.deadlines?.length || 0;
  const totalKeyPoints = meeting.keyPoints?.length || 0;

  return (
    <div className="ai-analytics">
      <div className="ai-analytics-header">
        <div>
          <span className="ai-label">AI ANALYSIS</span>

          <h2>
            <FiCpu />
            Meeting Intelligence
          </h2>

          <p>AI-generated insights from this meeting.</p>
        </div>
      </div>

      <div className="ai-stats">
        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <FiCpu />
          </div>

          <div>
            <p>AI Summary</p>
            <strong>{hasSummary ? "Ready" : "Not Generated"}</strong>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <FiZap />
          </div>

          <div>
            <p>Action Items</p>
            <strong>{totalActions}</strong>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <FiBookmark />
          </div>

          <div>
            <p>Decisions</p>
            <strong>{totalDecisions}</strong>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <FiClock />
          </div>

          <div>
            <p>Deadlines</p>
            <strong>{totalDeadlines}</strong>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <FiCheckCircle />
          </div>

          <div>
            <p>Key Points</p>
            <strong>{totalKeyPoints}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAnalytics;
