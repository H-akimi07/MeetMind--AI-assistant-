import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FiBarChart2 } from "react-icons/fi";

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
    <div
      className="
        box-border mt-[18px] flex h-[150px] w-full
        flex-col justify-center overflow-hidden
        rounded-[16px]
        border border-[rgba(212,175,55,0.22)]
        bg-[linear-gradient(145deg,#111,#181818)]
        px-5 py-[14px]
        text-white

        min-[801px]:h-[150px]
        max-[800px]:min-h-[125px]
        max-[800px]:h-auto
      "
    >
      <div className="mb-[5px] flex items-center gap-[7px] text-[15px] font-semibold text-[#d4af37]">
        <FiBarChart2 className="text-[18px]" />
        <span>Meeting Analytics</span>
      </div>

      <div
        className="
          flex h-[75px] items-center
          max-[600px]:h-auto
        "
      >
        <div
          className="
            h-[75px] w-[90px]
            max-[600px]:hidden
          "
        >
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

        <div
          className="
            flex flex-col justify-center
            border-r border-[#292929]
            px-5
            max-[600px]:pl-0
          "
        >
          <span className="text-[11px] text-[#777]">Total</span>

          <strong className="text-[20px] text-white">{total}</strong>
        </div>

        <div
          className="
            flex items-center gap-[25px] pl-5
            max-[800px]:flex-wrap
            max-[800px]:gap-3
            max-[600px]:gap-[10px]
            max-[600px]:pl-[15px]
          "
        >
          <div className="flex items-center gap-[6px] whitespace-nowrap">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#d4af37]" />
            <span className="text-[12px] text-[#888]">Scheduled</span>
            <strong className="text-[14px] text-white">{data[0].value}</strong>
          </div>

          <div className="flex items-center gap-[6px] whitespace-nowrap">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#00c853]" />
            <span className="text-[12px] text-[#888]">Live</span>
            <strong className="text-[14px] text-white">{data[1].value}</strong>
          </div>

          <div className="flex items-center gap-[6px] whitespace-nowrap">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#2979ff]" />
            <span className="text-[12px] text-[#888]">Completed</span>
            <strong className="text-[14px] text-white">{data[2].value}</strong>
          </div>

          <div className="flex items-center gap-[6px] whitespace-nowrap">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#e53935]" />
            <span className="text-[12px] text-[#888]">Cancelled</span>
            <strong className="text-[14px] text-white">{data[3].value}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
