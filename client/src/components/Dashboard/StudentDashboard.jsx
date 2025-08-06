// pages/student/StudentDashboard.jsx
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer"; // Import the Footer
import { FiBookOpen, FiAward, FiUser, FiSettings } from "react-icons/fi";

const StudentDashboard = () => {
  const studentLinks = [
    { label: "My Courses", path: "/student/courses", icon: <FiBookOpen /> },
    { label: "Certificates", path: "/student/certificates", icon: <FiAward /> },
    { label: "Profile", path: "/profile", icon: <FiUser /> },
    { label: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <div className="flex ">
      <Sidebar links={studentLinks} />
      <div className="ml-64 w-full flex flex-col min-h-screen">
        <main className="flex-grow bg-[#1a1a1a] text-white p-10">
          <h1 className="text-3xl font-semibold mb-4 pt-10">Welcome Student!</h1>
          {/* Content here */}
        </main>
        <Footer /> {/* Add Footer here */}
      </div>
    </div>
  );
};

export default StudentDashboard;