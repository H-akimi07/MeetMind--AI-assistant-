import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { FiBarChart2 } from "react-icons/fi";

import "./Analytics.css";

function Analytics({ meetings = [] }) {
  const data = [
    {
      name: "Scheduled",
      value: meetings.filter((m) => m.status === "scheduled").length,
    },

    {
      name: "Live",
      value: meetings.filter((m) => m.status === "live").length,
    },

    {
      name: "Completed",
      value: meetings.filter((m) => m.status === "completed").length,
    },

    {
      name: "Cancelled",
      value: meetings.filter((m) => m.status === "cancelled").length,
    },
  ];

  const total = meetings.length;

  return (
    <div className="analytics-card">
      <div className="analytics-title">
        <FiBarChart2 />

        <span>Meeting Analytics</span>
      </div>

      <div className="analytics-content">
        <div className="analytics-chart">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={28}
                outerRadius={42}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={["#D4AF37", "#00C853", "#2979FF", "#E53935"][index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-total">
          <span>Total</span>

          <strong>{total}</strong>
        </div>

        <div className="analytics-stats">
          <div>
            <span className="dot scheduled"></span>

            <span>Scheduled</span>

            <strong>{data[0].value}</strong>
          </div>

          <div>
            <span className="dot live"></span>

            <span>Live</span>

            <strong>{data[1].value}</strong>
          </div>

          <div>
            <span className="dot completed"></span>

            <span>Completed</span>

            <strong>{data[2].value}</strong>
          </div>

          <div>
            <span className="dot cancelled"></span>

            <span>Cancelled</span>

            <strong>{data[3].value}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
