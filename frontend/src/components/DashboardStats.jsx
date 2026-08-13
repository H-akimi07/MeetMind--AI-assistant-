import {
  FiCalendar,
  FiFileText,
  FiFolder,
  FiCheckCircle,
} from "react-icons/fi";

function DashboardStats({ meetings, summaries, files, tasks }) {
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
    <div
      className="
        mb-[22px] grid
        grid-cols-4 gap-[14px]

        max-[1000px]:grid-cols-2

        max-[600px]:grid-cols-2
        max-[600px]:gap-[10px]
      "
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="
            flex min-h-[78px] items-center justify-between
            rounded-[15px]
            border border-[#232323]
            bg-[#111]
            px-[18px] py-4
            transition duration-300 ease-in-out

            hover:-translate-y-[3px]
            hover:border-[#d4af37]
            hover:shadow-[0_0_20px_rgba(212,175,55,0.12)]

            max-[600px]:p-[14px]
          "
        >
          <div>
            <h4
              className="
                mb-[5px] text-[13px] font-medium
                text-[#888]
                max-[600px]:text-[12px]
              "
            >
              {card.title}
            </h4>

            <h2
              className="
                m-0 text-[25px] font-bold text-white
                max-[600px]:text-[22px]
              "
            >
              {card.value}
            </h2>
          </div>

          <div
            className="
              flex h-[38px] w-[38px]
              items-center justify-center
              rounded-[10px]
              bg-[rgba(212,175,55,0.08)]
              text-[22px] text-[#d4af37]

              max-[600px]:h-[34px]
              max-[600px]:w-[34px]
              max-[600px]:text-[19px]
            "
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
