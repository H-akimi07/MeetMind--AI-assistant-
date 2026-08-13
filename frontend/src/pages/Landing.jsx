import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";

import AIFeatures from "../components/AIFeatures";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#000] text-white">
      <Navbar />

      <div className="px-5 sm:px-10 lg:px-20">
        {/* HERO */}
        <section
          className="
            flex min-h-[80vh] flex-col items-center justify-between
            gap-10 py-20
            lg:flex-row lg:gap-20 lg:px-[8%] lg:py-[120px]
          "
        >
          <motion.div
            className="w-full max-w-[650px] text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span
              className="
                inline-block rounded-full
                border border-[rgba(212,175,55,0.25)]
                bg-[rgba(212,175,55,0.08)]
                px-[22px] py-[10px]
                text-[#f5d76e]
              "
            >
              ✨ AI Meeting Intelligence
            </span>

            <h1
              className="
                mt-[30px]
                text-[42px] font-extrabold leading-[1.1]
                tracking-[-1px]
                text-white
                sm:text-[52px]
                md:text-[60px]
                lg:text-[72px]
                xl:text-[75px]
              "
            >
              <TypeAnimation
                sequence={[
                  "Think smarter.\nMeet better.",
                  2000,

                  "Summarize meetings\nwith AI.",
                  2000,

                  "Turn conversations\ninto action.",
                  2000,

                  "Your intelligent\nmeeting assistant.",
                  2000,
                ]}
                wrapper="span"
                speed={45}
                repeat={Infinity}
                style={{
                  whiteSpace: "pre-line",
                  display: "inline-block",
                  color: "#d4af37",
                }}
                cursor={true}
              />
            </h1>

            <p
              className="
                mt-[30px]
                min-h-[90px]
                text-[17px]
                leading-[1.8]
                text-[#cfcfcf]
                sm:text-[18px]
                lg:text-[20px]
              "
            >
              MeetMind transforms conversations into intelligent summaries,
              decisions, and actionable insights.
            </p>

            <div
              className="
                mt-10 flex flex-col justify-center gap-4
                sm:flex-row
                lg:justify-start
              "
            >
              <Link to="/register" className="w-full sm:w-auto">
                <motion.button
                  className="
                    w-full rounded-[40px]
                    border-none
                    bg-[#d4af37]
                    px-[38px] py-4
                    text-[16px] font-bold text-black
                    transition-all
                  "
                  whileHover={{ scale: 1.08 }}
                >
                  Start Free
                </motion.button>
              </Link>

              <Link to="/login" className="w-full sm:w-auto">
                <motion.button
                  className="
                    w-full rounded-[40px]
                    border border-[rgba(212,175,55,0.25)]
                    bg-transparent
                    px-[38px] py-4
                    text-[16px] text-white
                    transition-all
                    hover:border-[#d4af37]
                    hover:text-[#d4af37]
                  "
                  whileHover={{ scale: 1.08 }}
                >
                  Explore AI
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* AI CARD */}
          <motion.div
            className="
              w-full max-w-[380px]
              rounded-[30px]
              border border-[rgba(212,175,55,0.25)]
              bg-gradient-to-br from-[#151515] to-[#080808]
              p-[35px]
              shadow-[0_0_40px_rgba(212,175,55,0.15)]
              lg:mt-[100px]
            "
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h3 className="text-[24px] text-[#d4af37]">🤖 MeetMind AI</h3>

            <p className="mt-5 text-white">Meeting analysis completed.</p>

            <div className="mt-[30px] leading-[2] text-[#aaa]">
              ✓ Summary generated
              <br />
              ✓ Decisions extracted
              <br />✓ Tasks created
            </div>
          </motion.div>
        </section>

        {/* AI FEATURES */}
        <AIFeatures />

        {/* HOW IT WORKS */}
        <section id="how" className="bg-[#050505] px-[8%] py-20 lg:py-[120px]">
          <div className="mx-auto mb-[70px] max-w-[700px] text-center">
            <span className="text-[14px] tracking-[3px] text-[#d4af37]">
              HOW IT WORKS
            </span>

            <h2 className="my-5 text-[32px] font-bold text-white sm:text-[45px] lg:text-[55px]">
              From conversation to intelligence.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-3">
            <div
              className="
                rounded-[25px]
                border border-[rgba(212,175,55,0.25)]
                bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(0,0,0,0.8)]
                p-10
                transition-all duration-500
                hover:-translate-y-3
                hover:border-[#d4af37]
                hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]
              "
            >
              <span className="text-[50px] text-[#d4af37]">01</span>

              <h3 className="mt-4 text-[28px] text-white">Record</h3>

              <p className="mt-3 leading-[1.7] text-[#aaa]">
                Capture your meetings effortlessly.
              </p>
            </div>

            <div
              className="
                rounded-[25px]
                border border-[rgba(212,175,55,0.25)]
                bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(0,0,0,0.8)]
                p-10
                transition-all duration-500
                hover:-translate-y-3
                hover:border-[#d4af37]
                hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]
              "
            >
              <span className="text-[50px] text-[#d4af37]">02</span>

              <h3 className="mt-4 text-[28px] text-white">Analyze</h3>

              <p className="mt-3 leading-[1.7] text-[#aaa]">
                Our AI understands your discussion.
              </p>
            </div>

            <div
              className="
                rounded-[25px]
                border border-[rgba(212,175,55,0.25)]
                bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(0,0,0,0.8)]
                p-10
                transition-all duration-500
                hover:-translate-y-3
                hover:border-[#d4af37]
                hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]
              "
            >
              <span className="text-[50px] text-[#d4af37]">03</span>

              <h3 className="mt-4 text-[28px] text-white">Improve</h3>

              <p className="mt-3 leading-[1.7] text-[#aaa]">
                Get insights and action plans.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="bg-[#050505] px-[8%] py-20 lg:py-[120px]"
        >
          <div className="mx-auto mb-[70px] max-w-[700px] text-center">
            <span className="text-[14px] tracking-[3px] text-[#d4af37]">
              PRICING
            </span>

            <h2 className="my-5 text-[32px] font-bold text-white sm:text-[45px] lg:text-[55px]">
              Simple. Transparent. Powerful.
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-[30px] md:flex-row md:flex-wrap">
            {[5, 10, 19].map((price) => (
              <div
                key={price}
                className="
                  mx-auto w-full max-w-[420px]
                  rounded-[25px]
                  border border-[rgba(212,175,55,0.25)]
                  bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(0,0,0,0.8)]
                  p-10 text-center
                  transition-all duration-500
                  hover:-translate-y-3
                  hover:border-[#d4af37]
                  hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]
                "
              >
                <h3 className="text-xl font-semibold text-white">Premium AI</h3>

                <h1 className="my-5 text-[60px] font-bold text-[#d4af37] sm:text-[70px]">
                  ${price}
                  <span className="text-[20px] text-white">/month</span>
                </h1>

                <ul className="mb-6">
                  <li className="my-[15px] list-none text-[#ccc]">
                    ✓ Unlimited summaries
                  </li>

                  <li className="my-[15px] list-none text-[#ccc]">
                    ✓ AI meeting analysis
                  </li>

                  <li className="my-[15px] list-none text-[#ccc]">
                    ✓ Action extraction
                  </li>

                  <li className="my-[15px] list-none text-[#ccc]">
                    ✓ Smart insights
                  </li>
                </ul>

                <button
                  className="
                    cursor-pointer rounded-[30px]
                    border-none
                    bg-[#d4af37]
                    px-10 py-4
                    font-bold text-black
                    transition-all
                    hover:scale-105
                    hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)]
                  "
                >
                  Start Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;
