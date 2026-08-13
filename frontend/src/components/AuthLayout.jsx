import { motion } from "framer-motion";
import "./AuthLayout.css";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-page">
      <motion.div
        className="auth-left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1>
          Meet<span>Mind</span>
        </h1>

        <p>AI Meeting Assistant</p>

        <div className="auth-features">
          <div>✨ AI Meeting Summaries</div>

          <div>🤖 Smart AI Assistant</div>

          <div>📂 Document Analysis</div>

          <div>⚡ Action Items Extraction</div>
        </div>
      </motion.div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>{title}</h2>

        <p className="auth-subtitle">{subtitle}</p>

        {children}
      </motion.div>
    </div>
  );
}

export default AuthLayout;
