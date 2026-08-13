import "./DashboardStats.css";

import {
  FiCalendar,
  FiFileText,
  FiFolder,
  FiCheckCircle,
} from "react-icons/fi";

function DashboardStats({
  meetings,

  summaries,

  files,

  tasks,
}) {
  const cards = [
    {
      title: "Meetings",

      value: meetings,

      icon: <FiCalendar />,
    },

    {
      title: "AI Summaries",

      value: summaries,

      icon: <FiFileText />,
    },

    {
      title: "Files",

      value: files,

      icon: <FiFolder />,
    },

    {
      title: "Tasks",

      value: tasks,

      icon: <FiCheckCircle />,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div>
            <h4>{card.title}</h4>

            <h2>{card.value}</h2>
          </div>

          <div className="stat-icon">{card.icon}</div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
