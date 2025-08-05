// pages/instructor/InstructorDashboard.jsx
import Sidebar from "@/components/Sidebar";

const InstructorDashboard = () => {
  const instructorLinks = [
    { label: "My Courses", path: "/instructor/courses" },
    { label: "Create Course", path: "/instructor/create" },
    { label: "Earnings", path: "/instructor/earnings" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex">
      <Sidebar links={instructorLinks} />
      <main className="ml-64 w-full min-h-screen bg-[#1a1a1a] text-white p-10">
        <h1 className="text-3xl font-semibold mb-4 pt-10">Welcome Instructor!</h1>
        {/* Content here */}
      </main>
    </div>
  );
};

export default InstructorDashboard;