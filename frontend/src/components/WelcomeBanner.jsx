import { useNavigate } from "react-router-dom";
import { FiPlus, FiUsers, FiSettings } from "react-icons/fi";

function WelcomeBanner() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#151515] to-[#080808] border border-[var(--border)] rounded-[20px] px-7 py-[22px] mt-[90px] mb-[25px] flex items-center justify-between max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-5">
      {/* TEXT */}
      <div>
        <h1 className="text-white text-[28px] m-0">Welcome back</h1>

        <p className="mt-2 text-[var(--text-secondary)] text-sm">
          Your meetings are becoming smarter with AI.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex items-center gap-3 max-[700px]:w-full">
        <button
          onClick={() => navigate("/create-meeting")}
          className="w-[50px] h-[50px] p-0 flex items-center justify-center gap-2 bg-[#111] text-white border border-[#d4af37] rounded-[14px] cursor-pointer transition duration-300 hover:bg-[#d4af37] hover:text-black hover:-translate-y-[3px] hover:shadow-[0_10px_25px_rgba(212,175,55,0.25)]"
        >
          <FiPlus className="text-[22px] text-[#d4af37] group-hover:text-black" />
        </button>

        <button
          onClick={() => navigate("/join-meeting")}
          className="w-[50px] h-[50px] p-0 flex items-center justify-center gap-2 bg-[#111] text-white border border-[#d4af37] rounded-[14px] cursor-pointer transition duration-300 hover:bg-[#d4af37] hover:text-black hover:-translate-y-[3px] hover:shadow-[0_10px_25px_rgba(212,175,55,0.25)]"
        >
          <FiUsers className="text-[22px] text-[#d4af37]" />
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="w-[50px] h-[50px] p-0 flex items-center justify-center gap-2 bg-[#111] text-white border border-[#d4af37] rounded-[14px] cursor-pointer transition duration-300 hover:bg-[#d4af37] hover:text-black hover:-translate-y-[3px] hover:shadow-[0_10px_25px_rgba(212,175,55,0.25)]"
        >
          <FiSettings className="text-[22px] text-[#d4af37]" />
        </button>
      </div>
    </div>
  );
}

export default WelcomeBanner;
