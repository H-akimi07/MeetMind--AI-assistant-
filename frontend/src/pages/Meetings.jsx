import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import MeetingCard from "../components/MeetingCard";
import { getMyMeetings } from "../api/meeting";

import "./Meetings.css";

function Meetings() {
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
      const matchesSearch = meeting.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

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
        return a.title.localeCompare(b.title);
      }

      if (sortOption === "za") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

  if (loading) {
    return (
      <MainLayout>
        <div className="meetings-loading">Loading meetings...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="meetings-page">
        <div className="meetings-page-header">
          <div>
            <h1>My Meetings</h1>

            <p>Manage all your meetings in one place.</p>
          </div>

          <button
            onClick={() => navigate("/create-meeting")}
            className="create-meeting-btn"
          >
            + New Meeting
          </button>
        </div>

        <div className="meeting-tools">
          <input
            type="text"
            placeholder="Search meetings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="status-filter"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A-Z</option>
            <option value="za">Title Z-A</option>
          </select>
        </div>

        <div className="meetings-list">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))
          ) : (
            <div className="empty-state">
              <h2>No Meetings Yet</h2>

              <p>Create your first AI meeting.</p>

              <button onClick={() => navigate("/create-meeting")}>
                Create Meeting
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Meetings;
