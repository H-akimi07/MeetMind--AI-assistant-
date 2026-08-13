import { useEffect, useState } from "react";

import { getMyMeetings } from "../api/meeting.js";

import AIAnalytics from "../components/AIAnalytics.jsx";

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
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading AI Analytics...
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] px-[30px] py-[30px] text-white max-md:px-5 max-md:py-5">
      <div className="mb-[25px]">
        <h1 className="m-0 mb-[6px] text-[30px] font-semibold text-white">
          AI Analytics
        </h1>

        <p className="m-0 text-[14px] text-[#888]">
          Track your AI-powered meeting productivity.
        </p>
      </div>

      <AIAnalytics meetings={meetings} />
    </div>
  );
}

export default AIAnalyticsPage;
