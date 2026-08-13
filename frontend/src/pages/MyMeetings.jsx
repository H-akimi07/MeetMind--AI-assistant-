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
        {/* HEADER */}

        <div className="mb-7 flex items-center justify-between gap-6 max-[800px]:flex-col max-[800px]:items-start">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 text-[13px] font-semibold text-[#D4AF37]">
              <FiCalendar />
              Workspace
            </span>

            <h1 className="m-0 text-[32px] font-bold text-white max-[500px]:text-[26px]">
              My Meetings
            </h1>

            <p className="mt-1.5 text-[#777] max-[500px]:text-[13px]">
              View, search and manage all your meetings.
            </p>
          </div>

          <button
            className="
              flex
              items-center
              gap-2
              cursor-pointer
              rounded-xl
              border-none
              bg-[#D4AF37]
              px-[18px] py-3
              font-bold
              text-[#050505]
              transition
              hover:-translate-y-0.5
              hover:shadow-[0_10px_25px_rgba(212,175,55,0.25)]
              max-[800px]:w-full
              max-[800px]:justify-center
            "
            onClick={() => navigate("/create-meeting")}
          >
            <FiPlus />
            Create Meeting
          </button>
        </div>

        {/* TOOLBAR */}

        <div
          className="
            mb-[15px]
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-[#242424]
            bg-[#111]
            p-3
            max-[800px]:flex-col
            max-[800px]:items-stretch
          "
        >
          <div
            className="
              flex
              flex-1
              items-center
              gap-2.5
              rounded-[10px]
              border
              border-[#292929]
              bg-[#080808]
              px-3.5 py-2.5
              text-[#777]
              max-[800px]:w-full
            "
          >
            <FiSearch />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-[#666]
              "
            />
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-[10px]
              border
              border-[#292929]
              bg-[#080808]
              px-3 py-2.5
              text-[#aaa]
              max-[800px]:w-full
            "
          >
            <FiFilter />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                w-full
                cursor-pointer
                bg-transparent
                text-[#aaa]
                outline-none
              "
            >
              <option value="all" className="bg-[#111] text-white">
                All Status
              </option>

              <option value="scheduled" className="bg-[#111] text-white">
                Scheduled
              </option>

              <option value="live" className="bg-[#111] text-white">
                Live
              </option>

              <option value="completed" className="bg-[#111] text-white">
                Completed
              </option>

              <option value="cancelled" className="bg-[#111] text-white">
                Cancelled
              </option>
            </select>
          </div>

          <select
            className="
              cursor-pointer
              rounded-[10px]
              border
              border-[#292929]
              bg-[#080808]
              px-3 py-2.5
              text-[#aaa]
              outline-none
              max-[800px]:w-full
            "
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest" className="bg-[#111] text-white">
              Newest
            </option>

            <option value="oldest" className="bg-[#111] text-white">
              Oldest
            </option>

            <option value="az" className="bg-[#111] text-white">
              Title A-Z
            </option>

            <option value="za" className="bg-[#111] text-white">
              Title Z-A
            </option>
          </select>
        </div>

        {/* RESULT COUNT */}

        <div className="my-[15px] ml-[3px] text-[13px] text-[#777]">
          <span>
            {filteredMeetings.length}{" "}
            {filteredMeetings.length === 1 ? "meeting" : "meetings"}
          </span>
        </div>

        {/* MEETING CARDS */}

        {filteredMeetings.length > 0 ? (
          <div className="flex flex-col gap-[15px]">
            {filteredMeetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div
            className="
              mt-5
              rounded-[20px]
              border
              border-[#242424]
              bg-[#111]
              p-[60px_20px]
              text-center
              max-[500px]:p-[45px_15px]
            "
          >
            <div
              className="
                mx-auto
                mb-[15px]
                flex
                h-[60px]
                w-[60px]
                items-center
                justify-center
                rounded-full
                bg-[rgba(212,175,55,0.1)]
                text-[28px]
                text-[#D4AF37]
              "
            >
              <FiCalendar />
            </div>

            <h2 className="mb-2 text-xl font-bold text-white">
              No Meetings Found
            </h2>

            <p className="mb-5 text-[#777]">
              {meetings.length === 0
                ? "Create your first AI meeting."
                : "Try changing your search or filter."}
            </p>

            {meetings.length === 0 && (
              <button
                onClick={() => navigate("/create-meeting")}
                className="
                  inline-flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-[10px]
                  border-none
                  bg-[#D4AF37]
                  px-5 py-3
                  font-bold
                  text-[#050505]
                "
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
