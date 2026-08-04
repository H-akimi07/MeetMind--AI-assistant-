import { useState } from "react";
import Topbar from "../components/Topbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./MainLayout.css";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-area">
        <button
          className="dashboard-menu-button"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <Topbar />
        <main className="content">{children}</main>
      </div>{" "}
      Hello.
    </div>
  );
}

export default MainLayout;
