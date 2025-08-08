import React, { useState, useEffect, useContext } from 'react';
import API from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiUsers, FiBookOpen, FiDollarSign, FiUserCheck, FiCheckCircle, FiGrid, FiFileText, FiUser } from "react-icons/fi";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ students: 0, instructors: 0, courses: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const adminLinks = [
        { label: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
        { label: "User Management", path: "/admin/users", icon: <FiUsers /> },
        { label: "Instructor Approvals", path: "/admin/approvals", icon: <FiUserCheck /> },
        { label: "Reports", path: "/admin/reports", icon: <FiFileText /> },
        { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiGrid /> },
         { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all users
                const usersRes = await API.get('/user/');
                const allUsers = usersRes.data.students.concat(usersRes.data.instructors);
                setUsers(allUsers);
                
                const pending = usersRes.data.instructors.filter(inst => !inst.isApproved);
                setPendingInstructors(pending);

                // Fetch all courses for stats
                const coursesRes = await API.get('/course/all');
                
                setStats({
                    students: usersRes.data.totalStudents,
                    instructors: usersRes.data.totalInstructors,
                    courses: coursesRes.data.total,
                    revenue: 5420.50 // Placeholder for revenue data
                });

            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleApproveInstructor = async (instructorId) => {
        if (window.confirm("Are you sure you want to approve this instructor?")) {
            try {
                await API.put(`/user/${instructorId}/approve`);
                setPendingInstructors(pendingInstructors.filter(inst => inst._id !== instructorId));
            } catch (error) {
                console.error("Failed to approve instructor:", error);
            }
        }
    };

    const userGrowthData = {
        labels: ['March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [{
            label: 'New Users',
            data: [12, 19, 15, 25, 22, 30],
            backgroundColor: 'rgba(129, 140, 248, 0.5)',
            borderColor: 'rgba(129, 140, 248, 1)',
            borderWidth: 1,
        }],
    };

    const courseCategoriesData = {
        labels: ['Web Dev', 'Data Science', 'Marketing', 'Design', 'Business'],
        datasets: [{
            label: 'Courses per Category',
            data: [12, 19, 8, 5, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
            ],
        }],
    };

    return (
        <div className="flex">
            <Sidebar links={adminLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">Admin Dashboard</h1>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800 flex items-center gap-4">
                            <FiUsers className="text-3xl text-indigo-400"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-400">Total Students</h3>
                                <p className="text-3xl font-bold">{stats.students}</p>
                            </div>
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800 flex items-center gap-4">
                            <FiUserCheck className="text-3xl text-green-400"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-400">Total Instructors</h3>
                                <p className="text-3xl font-bold">{stats.instructors}</p>
                            </div>
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800 flex items-center gap-4">
                            <FiBookOpen className="text-3xl text-yellow-400"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-400">Total Courses</h3>
                                <p className="text-3xl font-bold">{stats.courses}</p>
                            </div>
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800 flex items-center gap-4">
                            <FiDollarSign className="text-3xl text-red-400"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-400">Total Revenue</h3>
                                <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Graphs */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h3 className="text-xl font-semibold mb-4">User Growth</h3>
                            <Bar data={userGrowthData} />
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h3 className="text-xl font-semibold mb-4">Course Categories</h3>
                            <Pie data={courseCategoriesData} />
                        </div>
                    </div>

                    {/* Pending Instructor Approvals */}
                    <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                        <h2 className="text-2xl font-bold mb-4">Pending Instructor Approvals</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="3" className="text-center p-4">Loading...</td></tr>
                                    ) : pendingInstructors.map(inst => (
                                        <tr key={inst._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                                            <td className="p-4 font-medium">{inst.name}</td>
                                            <td className="p-4">{inst.email}</td>
                                            <td className="p-4">
                                                <button onClick={() => handleApproveInstructor(inst._id)} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-green-500/40">
                                                    <FiCheckCircle/> Approve
                                                </button>
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

export default AdminDashboard;
