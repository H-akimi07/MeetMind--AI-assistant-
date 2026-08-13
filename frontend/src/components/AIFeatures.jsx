import "./AIFeatures.css";
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
    <section className="features-section">
      <div className="features-header">
        <span>POWERFUL FEATURES</span>

        <h2>
          Everything Your <span>AI Meeting Assistant</span> Needs
        </h2>

        <p>
          MeetMind transforms conversations into actionable insights with
          intelligent automation before, during, and after every meeting.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AIFeatures;
