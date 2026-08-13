import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#070707]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <div className="p-[30px]">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
