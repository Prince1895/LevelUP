// pages/admin/AdminDashboard.jsx
import Sidebar from "@/components/Sidebar";

const AdminDashboard = () => {
  const adminLinks = [
    { label: "User Management", path: "/admin/users" },
    { label: "Instructor Approvals", path: "/admin/approvals" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex">
      <Sidebar links={adminLinks} />
      <main className="ml-64 w-full min-h-screen bg-[#1a1a1a] text-white p-10">
        <h1 className="text-3xl font-semibold mb-4">Welcome Admin!</h1>
        {/* Content here */}
      </main>
    </div>
  );
};

export default AdminDashboard;
