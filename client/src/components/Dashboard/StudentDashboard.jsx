// pages/student/StudentDashboard.jsx
import Sidebar from "@/components/Sidebar";

const StudentDashboard = () => {
  const studentLinks = [
    { label: "My Courses", path: "/student/courses" },
    { label: "Certificates", path: "/student/certificates" },
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex">
      <Sidebar links={studentLinks} />
      <main className="ml-64 w-full min-h-screen bg-[#1a1a1a] text-white p-10">
        <h1 className="text-3xl font-semibold mb-4">Welcome Student!</h1>
        {/* Content here */}
      </main>
    </div>
  );
};

export default StudentDashboard;
