import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyMeetings } from "../api/meeting.js";
import MeetingCard from "../components/MeetingCard.jsx";

import { FiSearch, FiPlus, FiCalendar, FiFilter } from "react-icons/fi";

import MainLayout from "../layouts/MainLayout.jsx";
import LoadingScreen from "../components/LoadingScreen";

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
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              <FiCalendar />
              Workspace
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Meetings
            </h1>

            <p className="mt-2 text-sm text-[#777]">
              View, search and manage all your meetings.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-meeting")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] bg-[length:200%_100%] px-5 py-3 font-bold text-black transition-all duration-300 hover:bg-[position:100%_0] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(212,175,55,0.3)] sm:w-auto"
          >
            <FiPlus />
            Create Meeting
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#242424] bg-[#111] p-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#292929] bg-[#080808] px-4 transition-all focus-within:border-[#D4AF37]/60">
            <FiSearch className="shrink-0 text-[#D4AF37]" />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-[#555]"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#292929] bg-[#080808] px-3">
            <FiFilter className="text-[#D4AF37]" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer bg-transparent py-2.5 text-sm text-[#aaa] outline-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="cursor-pointer rounded-xl border border-[#292929] bg-[#080808] px-4 py-2.5 text-sm text-[#aaa] outline-none focus:border-[#D4AF37]/60"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A-Z</option>
            <option value="za">Title Z-A</option>
          </select>
        </div>

        {/* Result */}
        <div className="mb-4 px-1 text-xs text-[#666]">
          {filteredMeetings.length}{" "}
          {filteredMeetings.length === 1 ? "meeting" : "meetings"}
        </div>

        {/* Cards */}
        {filteredMeetings.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredMeetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#242424] bg-[#111] px-5 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-2xl text-[#D4AF37]">
              <FiCalendar />
            </div>

            <h2 className="text-xl font-semibold text-white">
              No Meetings Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#777]">
              {meetings.length === 0
                ? "Create your first AI meeting."
                : "Try changing your search or filter."}
            </p>

            {meetings.length === 0 && (
              <button
                onClick={() => navigate("/create-meeting")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-black transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.25)]"
              >
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
