import { useEffect, useState } from "react";

import { getMyMeetings } from "../api/meeting.js";

import AIAnalytics from "../components/AIAnalytics.jsx";

import "./AIAnalyticsPage.css";

function AIAnalyticsPage() {
  const [meetings, setMeetings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const res = await getMyMeetings();

        setMeetings(res.data);
      } catch (error) {
        console.log("AI ANALYTICS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  if (loading) {
    return <div className="ai-page-loading">Loading AI Analytics...</div>;
  }

  return (
    <div className="ai-analytics-page">
      <div className="ai-page-header">
        <h1>AI Analytics</h1>

        <p>Track your AI-powered meeting productivity.</p>
      </div>

      <AIAnalytics meetings={meetings} />
    </div>
  );
}

export default AIAnalyticsPage;
