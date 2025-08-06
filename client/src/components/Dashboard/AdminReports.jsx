import React from 'react';
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiUsers, FiUserCheck, FiGrid, FiFileText, FiUser } from "react-icons/fi";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdminReports = () => {
    const adminLinks = [
        { label: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
        { label: "User Management", path: "/admin/users", icon: <FiUsers /> },
        { label: "Instructor Approvals", path: "/admin/approvals", icon: <FiUserCheck /> },
        { label: "Reports", path: "/admin/reports", icon: <FiFileText /> },
          { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    // Dummy data for charts - replace with real data from your API
    const revenueByMonthData = {
        labels: ['March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [{
            label: 'Monthly Revenue',
            data: [1200, 1900, 3000, 5000, 2200, 3000],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }],
    };
    
    const popularCoursesData = {
        labels: ['Web Dev Fundamentals', 'Intro to Data Science', 'Digital Marketing 101', 'UI/UX for Beginners', 'Advanced JavaScript'],
        datasets: [{
            label: 'Enrollments',
            data: [120, 95, 75, 60, 50],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
        }],
    };

    return (
        <div className="flex">
            <Sidebar links={adminLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">Admin Reports</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">Revenue by Month</h2>
                            <Line data={revenueByMonthData} />
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">Most Popular Courses</h2>
                            <Bar data={popularCoursesData} />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default AdminReports;
