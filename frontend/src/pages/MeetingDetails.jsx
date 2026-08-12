// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import AIAnalytics from "../components/AIAnalytics.jsx";
// import MainLayout from "../layouts/MainLayout.jsx";
// import LoadingScreen from "../components/LoadingScreen";
// import { getMeetingById } from "../api/meeting.js";

// import {
//   FiArrowLeft,
//   FiCalendar,
//   FiClock,
//   FiKey,
//   FiExternalLink,
// } from "react-icons/fi";

// import "./MeetingDetails.css";

// function MeetingDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [meeting, setMeeting] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadMeeting = async () => {
//       try {
//         const res = await getMeetingById(id);

//         setMeeting(res.data);
//       } catch (error) {
//         console.error("GET MEETING ERROR:", error);

//         toast.error(error.response?.data?.message || "Failed to load meeting");

//         navigate("/meetings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadMeeting();
//   }, [id, navigate]);

//   if (loading) {
//     return <LoadingScreen title="Meeting" />;
//   }

//   if (!meeting) {
//     return null;
//   }

//   const formattedDate = new Date(meeting.scheduledAt).toLocaleDateString(
//     undefined,
//     {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     },
//   );

//   const formattedTime = new Date(meeting.scheduledAt).toLocaleTimeString(
//     undefined,
//     {
//       hour: "2-digit",
//       minute: "2-digit",
//     },
//   );

//   return (
//     <MainLayout>
//       <div className="meeting-details-page">
//         <button
//           className="back-meetings-btn"
//           onClick={() => navigate("/meetings")}
//         >
//           <FiArrowLeft />
//           Back to Meetings
//         </button>
//         {/*
//         <div className="meeting-details-card"> */}
//         <AIAnalytics meeting={meeting} />
//         <div className="meeting-details-header">
//           <div>
//             <span className="meeting-details-label">Meeting Details</span>

//             <h1>{meeting.title}</h1>

//             <span className={`meeting-details-status ${meeting.status}`}>
//               {meeting.status}
//             </span>
//           </div>
//         </div>

//         {meeting.description && (
//           <div className="meeting-details-section">
//             <h2>Description</h2>
//             <p>{meeting.description}</p>
//           </div>
//         )}

//         <div className="meeting-details-grid">
//           <div className="meeting-detail-item">
//             <FiCalendar />

//             <div>
//               <span>Date</span>
//               <strong>{formattedDate}</strong>
//             </div>
//           </div>

//           <div className="meeting-detail-item">
//             <FiClock />

//             <div>
//               <span>Time</span>
//               <strong>{formattedTime}</strong>
//             </div>
//           </div>

//           <div className="meeting-detail-item">
//             <FiClock />

//             <div>
//               <span>Duration</span>
//               <strong>{meeting.duration || 60} minutes</strong>
//             </div>
//           </div>

//           <div className="meeting-detail-item">
//             <FiKey />

//             <div>
//               <span>Meeting Code</span>
//               <strong>{meeting.meetingCode}</strong>
//             </div>
//           </div>
//         </div>

//         <div className="meeting-details-actions">
//           {meeting.meetingUrl && (
//             <a
//               href={meeting.meetingUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="join-google-meet-btn"
//             >
//               <FiExternalLink />
//               Open Google Meet
//             </a>
//           )}

//           <button className="back-btn" onClick={() => navigate("/meetings")}>
//             Back to Meetings
//           </button>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// export default MeetingDetails;

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
