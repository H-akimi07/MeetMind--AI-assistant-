import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyMeetings } from "../api/meeting.js";
import MeetingCard from "../components/MeetingCard.jsx";

import { FiSearch, FiPlus, FiCalendar, FiFilter } from "react-icons/fi";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";
import "./MyMeetings.css";

function MyMeetings() {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const res = await getMyMeetings();

        setMeetings(res.data);
      } catch (error) {
        console.log("MEETINGS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  const filteredMeetings = meetings
    .filter((meeting) => {
      const title = meeting.title || "";

      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : meeting.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOption === "az") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortOption === "za") {
        return (b.title || "").localeCompare(a.title || "");
      }

      return 0;
    });

  if (loading) {
    return <LoadingScreen title="Meetings" />;
  }

  return (
    <MainLayout>
      <div className="my-meetings-page">
        {/* Header */}

        <div className="meetings-page-header">
          <div>
            <span className="page-label">
              <FiCalendar />
              Workspace
            </span>

            <h1>My Meetings</h1>

            <p>View, search and manage all your meetings.</p>
          </div>

          <button
            className="create-meeting-btn"
            onClick={() => navigate("/create-meeting")}
          >
            <FiPlus />
            Create Meeting
          </button>
        </div>

        {/* Tools */}

        <div className="meetings-toolbar">
          <div className="meeting-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="meeting-filter">
            <FiFilter />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select
            className="meeting-sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A-Z</option>
            <option value="za">Title Z-A</option>
          </select>
        </div>

        {/* Results */}

        <div className="meetings-result-info">
          <span>
            {filteredMeetings.length}{" "}
            {filteredMeetings.length === 1 ? "meeting" : "meetings"}
          </span>
        </div>

        {/* Meeting Cards */}

        {filteredMeetings.length > 0 ? (
          <div className="meetings-list">
            {filteredMeetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="meetings-empty">
            <div className="empty-icon">
              <FiCalendar />
            </div>

            <h2>No Meetings Found</h2>

            <p>
              {meetings.length === 0
                ? "Create your first AI meeting."
                : "Try changing your search or filter."}
            </p>

            {meetings.length === 0 && (
              <button onClick={() => navigate("/create-meeting")}>
                <FiPlus />
                Create Meeting
              </button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyMeetings;
