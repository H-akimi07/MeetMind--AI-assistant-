import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./DashboardLayout.css";

function DashboardLayout({ children }) {

  return (

    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          {children}

        </div>

      </div>

    </div>

  );

}

export default DashboardLayout;