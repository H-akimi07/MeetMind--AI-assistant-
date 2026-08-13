import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCalendar, FiCheckCircle, FiCpu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { getProfile } from "../api/user";
import { getMyMeetings } from "../api/meeting";

function Topbar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        console.log("TOPBAR PROFILE ERROR:", error);
      }
    };

    loadProfile();

    const loadNotifications = async () => {
      try {
        const res = await getMyMeetings();

        const now = new Date();

        const upcoming = res.data.filter((meeting) => {
          const meetingTime = new Date(meeting.scheduledAt);
          const diff = (meetingTime - now) / 1000 / 60;

          return diff > 0 && diff <= 15;
        });

        setNotifications(upcoming);
      } catch (error) {
        console.log(error);
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="w-full box-border flex items-center justify-between px-[30px] py-5 bg-[#111] border-b border-[#252525] max-[700px]:px-5 max-[700px]:py-4 max-[500px]:p-[15px]">
      {/* LEFT */}
      <div>
        <h2 className="m-0 text-white text-[22px] max-[700px]:text-[18px]">
          Welcome Back{user?.name ? `, ${user.name}` : ""}
        </h2>

        <p className="text-[#888] m-[5px_0_0] text-sm max-[700px]:text-xs max-[500px]:hidden">
          Manage your meetings smarter with AI.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 max-[500px]:gap-3">
        {/* NOTIFICATION */}
        <div className="relative">
          <button
            className="relative bg-transparent border-none cursor-pointer text-white text-2xl flex items-center justify-center p-0"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FiBell />

            {notifications.length > 0 && (
              <span className="absolute -top-[5px] -right-[5px] w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotifications && (
            <div className="absolute top-[70px] right-0 w-[340px] bg-[#111] border border-[rgba(212,175,55,0.25)] rounded-[18px] p-[18px] shadow-[0_15px_45px_rgba(0,0,0,0.45)] z-[1000] max-[500px]:fixed max-[500px]:top-[70px] max-[500px]:left-[15px] max-[500px]:right-[15px] max-[500px]:w-auto">
              {/* TITLE */}
              <div className="flex items-center gap-2.5 text-[#d4af37] text-lg font-bold mb-[18px]">
                <FiBell />
                <span>Notifications</span>
              </div>

              {/* UPCOMING MEETINGS */}
              {notifications.length === 0 ? (
                <p className="text-[#999] text-sm">No new notifications</p>
              ) : (
                notifications.map((meeting) => (
                  <div
                    className="flex items-center gap-[15px] p-[14px] rounded-[14px] bg-[#171717] mb-3 cursor-pointer transition-all duration-300 hover:bg-[#222] hover:translate-x-[5px]"
                    key={meeting._id}
                  >
                    <div className="w-[46px] h-[46px] shrink-0 rounded-full flex items-center justify-center text-xl bg-[rgba(212,175,55,0.15)] text-[#d4af37]">
                      <FiCalendar />
                    </div>

                    <div>
                      <strong className="block text-white mb-[6px]">
                        {meeting.title}
                      </strong>

                      <p className="text-[#999] text-[13px] m-0">
                        Starts at{" "}
                        {new Date(meeting.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* AI NOTIFICATION */}
              <div className="flex items-center gap-[15px] p-[14px] rounded-[14px] bg-[#171717] mb-3 cursor-pointer transition-all duration-300 hover:bg-[#222] hover:translate-x-[5px]">
                <div className="w-[46px] h-[46px] shrink-0 rounded-full flex items-center justify-center text-xl bg-[rgba(0,174,255,0.15)] text-[#00aeff]">
                  <FiCpu />
                </div>

                <div>
                  <h4 className="text-white text-[15px] m-0 mb-[5px]">
                    AI Summary Ready
                  </h4>

                  <p className="text-[#999] text-[13px] m-0">
                    Team Meeting summary has been generated.
                  </p>
                </div>
              </div>

              {/* SUCCESS NOTIFICATION */}
              <div className="flex items-center gap-[15px] p-[14px] rounded-[14px] bg-[#171717] cursor-pointer transition-all duration-300 hover:bg-[#222] hover:translate-x-[5px]">
                <div className="w-[46px] h-[46px] shrink-0 rounded-full flex items-center justify-center text-xl bg-[rgba(0,200,83,0.15)] text-[#00c853]">
                  <FiCheckCircle />
                </div>

                <div>
                  <h4 className="text-white text-[15px] m-0 mb-[5px]">
                    Workshop Reminder
                  </h4>

                  <p className="text-[#999] text-[13px] m-0">
                    Starts in 10 minutes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <Link to="/profile">
          <FaUserCircle className="text-[#d4af37] text-[42px] transition-transform duration-300 hover:scale-110 max-[700px]:text-[36px] max-[500px]:text-[32px]" />
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
