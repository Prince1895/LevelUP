import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import { FiBook, FiPlusSquare, FiDollarSign, FiUser, FiEdit, FiTrash2, FiEye, FiUsers, FiFileText, FiBarChart2, FiCheckSquare, FiGrid } from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// --- Main Component ---
const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0, totalQuizzes: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const instructorLinks = [
    { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
    { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
    { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
    { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
    { label: "Manage Quizzes", path: "/instructor/quizzes", icon: <FiCheckSquare/> },
    { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiGrid /> },
    { label: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await API.get('/course/instructor/my-courses');
        const instructorCourses = response.data.courses;
        setCourses(instructorCourses);

        const totalStudents = instructorCourses.reduce((acc, course) => acc + course.studentCount, 0);
        // Fetch additional stats from dedicated endpoints if available
        // For now, we'll use dummy data for revenue and quizzes
        setStats({ totalStudents, totalRevenue: 1250, totalQuizzes: 15 });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await API.delete(`/course/delete/${courseId}`);
        setCourses(courses.filter(c => c._id !== courseId));
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  const enrollmentData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'New Enrollments',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: [120, 190, 300, 500, 200, 300],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar links={instructorLinks} />
      <div className="ml-64 w-full flex flex-col min-h-screen">
        <Navbar/>
        <main className="flex-grow bg-[#1a1a1a] text-white p-10">
          <div className="flex justify-between items-center mb-8 pt-10">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Instructor'}! 👋</h1>
            <Link to="/instructor/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              <FiPlusSquare /> Create New Course
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Courses</h3>
              <p className="text-4xl font-bold">{courses.length}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Students</h3>
              <p className="text-4xl font-bold">{stats.totalStudents}</p>
            </div>
             <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Quizzes</h3>
              <p className="text-4xl font-bold">{stats.totalQuizzes}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Revenue</h3>
              <p className="text-4xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          
          {/* Analytics Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Enrollment Trends</h3>
                <Bar data={enrollmentData} />
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Revenue Growth</h3>
                <Line data={revenueData} />
            </div>
          </div>

          {/* My Courses Table */}
          <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4">Title</th>
                    <th className="p-4">Students</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center p-4">Loading courses...</td></tr>
                  ) : courses.map(course => (
                    <tr key={course._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                      <td className="p-4 font-medium">{course.title}</td>
                      <td className="p-4">{course.studentCount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${course.published ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">${course.price.toFixed(2)}</td>
                      <td className="p-4 flex items-center gap-3">
                        <Link to={`/instructor/course/${course._id}/edit`} className="text-gray-400 hover:text-indigo-400"><FiEdit /></Link>
                        <button onClick={() => handleDeleteCourse(course._id)} className="text-gray-400 hover:text-red-400"><FiTrash2 /></button>
                        <button className="text-gray-400 hover:text-blue-400"><FiEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default InstructorDashboard;
