import { useEffect, useState } from "react";
import DashboardStats from "../components/DashboardStats";
import { getMyMeetings } from "../api/meeting.js";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import MainLayout from "../layouts/MainLayout.jsx";
import WelcomeBanner from "../components/WelcomeBanner.jsx";

import Analytics from "../components/Analytics.jsx";
import AIAnalyticsPage from "./AIAnalyticsPage.jsx";

import { getProfile } from "../api/auth.js";
import LoadingScreen from "../components/LoadingScreen";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load Profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();

        setUser(res.data);
      } catch (error) {
        console.log("PROFILE ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");

          navigate("/login");
        }
      }
    };

    loadProfile();
  }, [navigate]);

  // Load Meetings
  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const res = await getMyMeetings();

        console.log("MEETINGS:", res.data);

        setMeetings(res.data);
      } catch (error) {
        console.log("MEETINGS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  // Statistics
  const meetingCount = meetings.length;

  const summaryCount = meetings.filter((meeting) => meeting.summary).length;

  const taskCount = meetings.reduce(
    (total, meeting) => total + (meeting.actionItems?.length || 0),
    0,
  );

  const fileCount = meetings.reduce(
    (total, meeting) => total + (meeting.attachments?.length || 0),
    0,
  );

  const completedCount = meetings.filter(
    (meeting) => meeting.status === "completed",
  ).length;

  if (loading) {
    return <LoadingScreen title="Dashboard" />;
  }

  return (
    <MainLayout>
      <WelcomeBanner />

      <DashboardStats
        meetings={meetingCount}
        summaries={summaryCount}
        tasks={taskCount}
        files={fileCount}
      />

      {/* COMPLETED */}

      <div
        className="
          mt-[5px] mb-[15px]
          inline-flex items-center gap-3
          rounded-[14px]
          border border-[#252525]
          bg-[#111]
          px-[18px] py-[10px]
        "
      >
        <div
          className="
            flex h-[34px] w-[34px]
            items-center justify-center
            rounded-[10px]
            bg-[rgba(212,175,55,0.1)]
            text-[18px] text-[#d4af37]
          "
        >
          <FiCheckCircle />
        </div>

        <div>
          <span className="block text-[11px] text-[#888]">Completed</span>

          <strong className="mt-0.5 block text-[18px] text-white">
            {completedCount}
          </strong>
        </div>
      </div>

      {/* MEETING ANALYTICS */}

      <div className="mt-[15px] rounded-2xl p-[15px]">
        <Analytics meetings={meetings} />
      </div>

      {/* AI ANALYTICS */}

      <div className="mt-[15px] rounded-2xl p-[15px] [&_.ai-analytics]:!mt-0 [&_.ai-analytics]:!rounded-2xl [&_.ai-analytics]:!p-[15px] [&_.ai-analytics_h2]:!mb-3 [&_.ai-analytics_h2]:!text-[18px] [&_.ai-stats]:!gap-2.5 [&_.ai-stat-card]:!rounded-xl [&_.ai-stat-card]:!p-3 [&_.ai-stat-card_h3]:!mb-1 [&_.ai-stat-card_h3]:!text-xl [&_.ai-stat-card_p]:!m-0 [&_.ai-stat-card_p]:!text-[11px] [&_.ai-stat-card_strong]:!text-xl">
        <AIAnalyticsPage meetings={meetings} />
      </div>

      {/* MY MEETINGS */}

      <div
        className="
          mt-[15px]
          flex items-center justify-between gap-[15px]
          rounded-2xl
          border border-[#252525]
          bg-[#111]
          px-5 py-4
          max-md:flex-col max-md:items-start
        "
      >
        <div>
          <h2 className="m-0 text-[18px] text-white">My Meetings</h2>

          <p className="mt-1 text-[12px] text-[#777]">
            View and manage all your meetings.
          </p>
        </div>

        <button
          onClick={() => navigate("/meetings")}
          className="
            w-[30%]
            whitespace-nowrap
            rounded-[10px]
            bg-[#d4af37]
            px-4 py-[9px]
            font-bold text-[#050505]
            transition-all
            hover:-translate-y-0.5
            hover:shadow-[0_8px_20px_rgba(212,175,55,0.25)]
            max-md:w-full
          "
        >
          View All →
        </button>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
