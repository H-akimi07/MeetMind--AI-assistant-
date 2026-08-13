import { motion } from "framer-motion";
import "./Landing.css";
import Navbar from "../components/Navbar.jsx";

import AIFeatures from "../components/AIFeatures";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
// import { Link } from "react-scroll";

function Landing() {
  return (
    <>
      <Navbar />

      <div className="landing">
        {/* Hero */}
        <section className="hero">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="badge">✨ AI Meeting Intelligence</span>

            <h1 className="hero-title">
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
                }}
                cursor={true}
              />
            </h1>
            <p>
              MeetMind transforms conversations into intelligent summaries,
              decisions, and actionable insights.
            </p>

            <div className="hero-buttons">
              <Link to="/register">
                <motion.button
                  className="primary-btn"
                  whileHover={{ scale: 1.08 }}
                >
                  Start Free
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="secondary-btn"
                  whileHover={{ scale: 1.08 }}
                >
                  Explore AI
                </motion.button>
              </Link>
            </div>
          </motion.div>

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
            <h3>🤖 MeetMind AI</h3>

            <p>Meeting analysis completed.</p>

            <div className="ai-result">
              ✓ Summary generated
              <br />
              ✓ Decisions extracted
              <br />✓ Tasks created
            </div>
          </motion.div>
        </section>

        {/* NEW SECTION */}
        <AIFeatures />

        {/* How it works Section */}

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

        {/* Pricing Section */}

        <section id="pricing" className="pricing-section">
          <div className="section-title">
            <span>PRICING</span>

            <h2>Simple. Transparent. Powerful.</h2>
          </div>
          <div className="pricingCard-section">
            <div className="price-card">
              <h3>Premium AI</h3>

              <h1>
                $5
                <span>/month</span>
              </h1>

              <ul>
                <li>✓ Unlimited summaries</li>

                <li>✓ AI meeting analysis</li>

                <li>✓ Action extraction</li>

                <li>✓ Smart insights</li>
              </ul>

              <button>Start Now</button>
            </div>
            <div className="price-card">
              <h3>Premium AI</h3>

              <h1>
                $10
                <span>/month</span>
              </h1>

              <ul>
                <li>✓ Unlimited summaries</li>

                <li>✓ AI meeting analysis</li>

                <li>✓ Action extraction</li>

                <li>✓ Smart insights</li>
              </ul>

              <button>Start Now</button>
            </div>
            <div className="price-card">
              <h3>Premium AI</h3>

              <h1>
                $19
                <span>/month</span>
              </h1>

              <ul>
                <li>✓ Unlimited summaries</li>

                <li>✓ AI meeting analysis</li>

                <li>✓ Action extraction</li>

                <li>✓ Smart insights</li>
              </ul>

              <button>Start Now</button>
            </div>
          </div>
        </section>

        {/* Contact */}
      </div>

      <Footer />
    </>
  );
}

export default Landing;
