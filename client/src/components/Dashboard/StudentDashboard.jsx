import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiBookOpen, FiAward, FiUser, FiSettings, FiPlayCircle, FiTrendingUp as FiFlame } from "react-icons/fi";

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({ enrolled: 0, completed: 0, certificates: 0, streak: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const studentLinks = [
        { label: "My Learning", path: "/dashboard", icon: <FiBookOpen /> },
        { label: "Browse Courses", path: "/student/courses", icon: <FiBookOpen /> },
        { label: "Certificates", path: "/student/certificates", icon: <FiAward /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
     
    ];

    useEffect(() => {
        // --- Daily Streak Logic ---
        // This should ideally be handled by your backend, but here's a client-side example
        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem('lastLoginDate');
        let currentStreak = parseInt(localStorage.getItem('dailyStreak') || '0');

        if (lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin === yesterday.toDateString()) {
                currentStreak++; // Increment streak if last login was yesterday
            } else {
                currentStreak = 1; // Reset if they missed a day
            }
            localStorage.setItem('dailyStreak', currentStreak.toString());
            localStorage.setItem('lastLoginDate', today);
        }
        // --- End of Streak Logic ---

        const fetchEnrollments = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const response = await API.get('/enrollment/my');
                const enrolledCourses = response.data.enrollments;
                setEnrollments(enrolledCourses);

                const completedCourses = enrolledCourses.filter(e => e.status === 'completed').length;
                const certificates = enrolledCourses.filter(e => e.certificateIssued).length;
                setStats({
                    enrolled: enrolledCourses.length,
                    completed: completedCourses,
                    certificates: certificates,
                    streak: currentStreak, // Set the streak in state
                });

            } catch (error) {
                console.error("Failed to fetch enrollments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEnrollments();
    }, [user]);

    const ProgressBar = ({ progress }) => (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    );

    return (
        <div className="flex">
            <Sidebar links={studentLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">Welcome, {user?.name}!</h1>

                    {/* Stats Cards */}
                    <div className=" text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-400">Courses Enrolled</h3>
                            <p className="text-4xl font-bold">{stats.enrolled}</p>
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-400">Courses Completed</h3>
                            <p className="text-4xl font-bold">{stats.completed}</p>
                        </div>
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-400">Certificates Earned</h3>
                            <p className="text-4xl font-bold">{stats.certificates}</p>
                        </div>
                         <div className="bg-[#111] p-6 rounded-lg border border-gray-800 flex items-center gap-4">
                            <FiFlame className="text-4xl text-orange-400"/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-400">Daily Streak</h3>
                                <p className="text-3xl font-bold">{stats.streak} Days</p>
                            </div>
                        </div>
                    </div>

                    {/* My Courses Section */}
                    <div className="bg-[#111] p-6 rounded-lg border border-gray-800 text-white">
                        <h2 className="text-2xl font-bold mb-4">My Learning</h2>
                        {isLoading ? <p>Loading your courses...</p> : (
                            <div className="space-y-4">
                                {enrollments.length > 0 ? enrollments.filter(enrollment => enrollment.course).map(({ course, progress = 0 }) => (
                                    <div key={course._id} className="bg-[#1a1a1a] p-4 rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <img src={course.image || 'https://placehold.co/100x70/1a1a1a/FFF?text=Course'} alt={course.title} className="w-24 h-16 object-cover rounded-md" />
                                            <div>
                                                <h3 className="font-bold text-lg">{course.title}</h3>
                                                <p className="text-sm text-gray-400">{course.category}</p>
                                                <div className="mt-2 w-full md:w-64">
                                                    <ProgressBar progress={progress} />
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/learn/course/${course._id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                                            <FiPlayCircle/> Continue Learning
                                        </Link>
                                    </div>
                                )) : <p className="text-gray-500">You are not enrolled in any courses yet.</p>}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default StudentDashboard;