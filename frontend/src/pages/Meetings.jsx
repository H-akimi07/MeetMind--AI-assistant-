import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import MeetingCard from "../components/MeetingCard";
import { getMyMeetings } from "../api/meeting.js";

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
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#292929] border-t-[#D4AF37]" />

            <p className="text-sm text-[#D4AF37]">Loading meetings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Workspace
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Meetings
            </h1>

            <p className="mt-2 text-sm text-[#777]">
              Manage all your meetings in one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-meeting")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] bg-[length:200%_100%] px-5 py-3 font-bold text-black shadow-[0_8px_25px_rgba(212,175,55,0.15)] transition-all duration-300 hover:bg-[position:100%_0] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(212,175,55,0.3)] sm:w-auto"
          >
            <span className="text-lg transition-transform group-hover:rotate-90">
              +
            </span>
            New Meeting
          </button>
        </div>

        {/* Tools */}
        <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-[#242424] bg-[#111]/90 p-3 shadow-[0_15px_40px_rgba(0,0,0,0.2)] md:flex-row">
          <div className="flex flex-1 items-center rounded-xl border border-[#292929] bg-[#080808] px-4 transition-all focus-within:border-[#D4AF37]/60 focus-within:shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <span className="mr-3 text-[#D4AF37]">⌕</span>

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#555]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-xl border border-[#292929] bg-[#080808] px-4 py-3 text-sm text-[#aaa] outline-none transition focus:border-[#D4AF37]/60"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="cursor-pointer rounded-xl border border-[#292929] bg-[#080808] px-4 py-3 text-sm text-[#aaa] outline-none transition focus:border-[#D4AF37]/60"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">Title A-Z</option>
            <option value="za">Title Z-A</option>
          </select>
        </div>

        {/* Result count */}
        <div className="mb-4 flex items-center justify-between px-1">
          <span className="text-xs text-[#666]">
            {filteredMeetings.length}{" "}
            {filteredMeetings.length === 1 ? "meeting" : "meetings"}
          </span>
        </div>

        {/* Meetings */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-[#292929] bg-[#111] px-5 py-16 text-center shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-2xl text-[#D4AF37]">
                ◇
              </div>

              <h2 className="text-xl font-semibold text-white">
                No Meetings Yet
              </h2>

              <p className="mt-2 text-sm text-[#777]">
                Create your first AI meeting.
              </p>

              <button
                onClick={() => navigate("/create-meeting")}
                className="mt-6 rounded-xl bg-[#D4AF37] px-5 py-3 font-bold text-black transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.25)]"
              >
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
