import { useEffect, useState } from "react";
import DashboardStats from "../components/DashboardStats";
import { getMyMeetings } from "../api/meeting.js";
import { useNavigate } from "react-router-dom";
// import { FiCheckCircle } from "react-icons/fi";

import "./Dashboard.css";

import MainLayout from "../layouts/MainLayout.jsx";
import WelcomeBanner from "../components/WelcomeBanner.jsx";

import Analytics from "../components/Analytics.jsx";
import AIAnalyticsPage from "./AIAnalyticsPage.jsx";

import { getProfile } from "../api/auth.js";
import LoadingScreen from "../components/LoadingScreen";

function Dashboard() {
  const [setUser] = useState(null);
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

  // const completedCount = meetings.filter(
  //   (meeting) => meeting.status === "completed",
  // ).length;

  // Loading

  if (loading) {
    return <LoadingScreen title="Dashboard" />;
  }

  // Dashboard

  return (
    <MainLayout>
      {/*  Welcome Banner*/}

      <WelcomeBanner />

      {/*  Main Statistics */}

      <DashboardStats
        meetings={meetingCount}
        summaries={summaryCount}
        tasks={taskCount}
        files={fileCount}
      />

      {/*  Meeting Analytics  */}

      <Analytics meetings={meetings} />

      {/*   AI Analytics */}

      <AIAnalyticsPage meetings={meetings} />

      {/*  Meetings Shortcut */}

      <div className="dashboard-shortcut">
        <div>
          <h2>My Meetings</h2>

          <p>View and manage all your meetings.</p>
        </div>

        <button onClick={() => navigate("/meetings")} className="view-all-btn">
          View All →
        </button>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
