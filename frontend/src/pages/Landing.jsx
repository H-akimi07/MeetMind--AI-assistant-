import { motion } from "framer-motion";
import "./Landing.css";
import Navbar from "../components/Navbar.jsx";

import AIFeatures from "../components/AIFeatures";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

import { FiCpu, FiCheck } from "react-icons/fi";

function Landing() {
  return (
    <>
      <Navbar />

      <div className="landing">
        {/* 
            HERO
        = */}

        <section className="hero">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Badge */}
            <span className="badge">
              <FiCpu />
              <span>AI Meeting Intelligence</span>
            </span>

            {/* Stable Typewriter Area */}
            <h1 className="hero-title">
              <span className="typewriter-text">
                <TypeAnimation
                  sequence={[
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
                  cursor={true}
                  style={{
                    whiteSpace: "pre-line",
                    display: "inline",
                  }}
                />
              </span>
            </h1>
            <p>
              MeetMind transforms conversations into intelligent summaries,
              decisions, and actionable insights.
            </p>

            {/* Hero Buttons */}
            <div className="hero-buttons">
              <Link to="/register" className="hero-btn-link">
                <motion.button
                  className="primary-btn"
                  whileHover={{ scale: 1.04 }}
                >
                  Start Free
                </motion.button>
              </Link>

              <Link to="/login" className="hero-btn-link">
                <motion.button
                  className="secondary-btn"
                  whileHover={{ scale: 1.04 }}
                >
                  Explore AI
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* 
              AI CARD
           */}

          <motion.div
            className="ai-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <h3>
              <FiCpu />
              MeetMind AI
            </h3>

            <p>Meeting analysis completed.</p>

            <div className="ai-result">
              <div>
                <FiCheck />
                <span>Summary generated</span>
              </div>

              <div>
                <FiCheck />
                <span>Decisions extracted</span>
              </div>

              <div>
                <FiCheck />
                <span>Tasks created</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 
            AI FEATURES
         */}

        <AIFeatures />

        {/* 
            HOW IT WORKS
         */}

        <section id="how" className="how-section">
          <div className="section-title">
            <span>HOW IT WORKS</span>

            <h2>From conversation to intelligence.</h2>
          </div>

          <div className="steps">
            <div className="step-card">
              <span>01</span>

              <h3>Record</h3>

              <p>Capture your meetings effortlessly.</p>
            </div>

            <div className="step-card">
              <span>02</span>

              <h3>Analyze</h3>

              <p>Our AI understands your discussion.</p>
            </div>

            <div className="step-card">
              <span>03</span>

              <h3>Improve</h3>

              <p>Get insights and action plans.</p>
            </div>
          </div>
        </section>

        {/* 
            PRICING
        = */}

        <section id="pricing" className="pricing-section">
          <div className="section-title">
            <span>PRICING</span>

            <h2>Simple. Transparent. Powerful.</h2>
          </div>

          <div className="pricingCard-section">
            {[5, 10, 19].map((price) => (
              <div className="price-card" key={price}>
                <h3>Premium AI</h3>

                <h1>
                  ${price}
                  <span>/month</span>
                </h1>

                <ul>
                  <li>
                    <FiCheck />
                    Unlimited summaries
                  </li>

                  <li>
                    <FiCheck />
                    AI meeting analysis
                  </li>

                  <li>
                    <FiCheck />
                    Action extraction
                  </li>

                  <li>
                    <FiCheck />
                    Smart insights
                  </li>
                </ul>

                <button>Start Now</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Landing;
