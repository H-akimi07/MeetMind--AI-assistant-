import { motion } from "framer-motion";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div
      className="
        flex min-h-screen items-center justify-center
        gap-8 bg-[radial-gradient(circle_at_top,#292000,#050505_60%)]
        p-10 text-white

        max-[900px]:flex-col
        max-[900px]:gap-[30px]
      "
    >
      <motion.div
        className="
          max-w-[420px]
          max-[900px]:text-center
        "
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-[70px] font-extrabold">
          Meet<span className="text-[#d4af37]">Mind</span>
        </h1>

        <p className="text-[22px] text-[#aaa]">AI Meeting Assistant</p>

        <div className="mt-10 flex flex-col gap-[18px]">
          <div className="rounded-[15px] border border-[rgba(212,175,55,0.2)] bg-[#111] px-5 py-[15px]">
            ✨ AI Meeting Summaries
          </div>

          <div className="rounded-[15px] border border-[rgba(212,175,55,0.2)] bg-[#111] px-5 py-[15px]">
            🤖 Smart AI Assistant
          </div>

          <div className="rounded-[15px] border border-[rgba(212,175,55,0.2)] bg-[#111] px-5 py-[15px]">
            📂 Document Analysis
          </div>

          <div className="rounded-[15px] border border-[rgba(212,175,55,0.2)] bg-[#111] px-5 py-[15px]">
            ⚡ Action Items Extraction
          </div>
        </div>
      </motion.div>

      <motion.div
        className="
          w-[420px]
          rounded-[25px]
          border border-[rgba(212,175,55,0.25)]
          bg-[#111]
          p-10
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]

          max-[900px]:w-full
          max-[900px]:max-w-[420px]
        "
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="mb-[10px] text-[35px]">{title}</h2>

        <p className="mb-[30px] text-[#888]">{subtitle}</p>

        {children}
      </motion.div>
    </div>
  );
}

export default AuthLayout;
