import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { FiX, FiClock, FiBarChart2, FiStar, FiUsers, FiBookOpen, FiAward, FiUser, FiSettings } from 'react-icons/fi';

// --- Course Detail Modal ---
const CourseDetailModal = ({ course, onClose, onEnroll }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 text-white right-4 text-2xl hover:text-red-500"><FiX /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={course.image || 'https://placehold.co/600x400/1a1a1a/FFF?text=Course'} alt={course.title} className="w-full h-auto object-cover rounded-lg mb-4"/>
                        <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                        <p className="text-gray-400 mb-4">Created by {course.instructor.name}</p>
                         <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                            <span className="capitalize flex items-center"><FiBarChart2 className="inline mr-1"/> {course.level}</span>
                            <span><FiClock className="inline mr-1"/> {course.duration}</span>
                            <span><FiUsers className="inline mr-1"/> 1,234 Students</span>
                            <span className="flex items-center"><FiStar className="inline mr-1 text-yellow-400"/> 4.5 (250 ratings)</span>
                        </div>
                        <p className="text-gray-300">{course.description}</p>
                    </div>
                    <div className="bg-[#111] text-white p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            <li>Master the fundamentals of {course.category}</li>
                            <li>Build real-world projects from scratch</li>
                            <li>Understand advanced concepts and best practices</li>
                            <li>Prepare for a career in the field</li>
                        </ul>
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-2">Price: ${course.price.toFixed(2)}</h3>
                            <button onClick={() => onEnroll(course)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition">
                                {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Student Courses Page Component ---
const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const studentLinks = [
        { label: "My Learning", path: "/dashboard", icon: <FiBookOpen /> },
        { label: "Browse Courses", path: "/student/courses", icon: <FiBookOpen /> },
        { label: "Certificates", path: "/student/certificates", icon: <FiAward /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
        { label: "Settings", path: "/settings", icon: <FiSettings /> },
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await API.get('/course/all');
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (course) => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            if (course.price === 0) {
                await API.post(`/enrollment/free/${course._id}`);
                alert("Successfully enrolled for free!");
            } else {
                const response = await API.post(`/enrollment/paid/${course._id}/create-order`);
                const { order } = response.data;
                alert(`Redirecting to payment for order: ${order.id}`);
            }
            setSelectedCourse(null);
        } catch (error) {
            alert(error.response?.data?.message || "Enrollment failed.");
        }
    };

    return (
        <div className="flex">
            <Sidebar links={studentLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">Browse Courses</h1>
                    {isLoading ? <p className="text-center">Loading courses...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map(course => (
                                <div key={course._id} onClick={() => setSelectedCourse(course)} className="cursor-pointer bg-[#111] border border-gray-800 rounded-lg shadow-lg hover:border-indigo-500 transition-all duration-300 flex flex-col">
                                    <img src={course.image || 'https://placehold.co/600x400/1a1a1a/FFF?text=Course'} alt={course.title} className="w-full h-48 object-cover rounded-t-lg"/>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
                                        <p className="text-sm text-gray-400 mb-4">By {course.instructor.name}</p>
                                        <p className="text-sm text-gray-300 mb-4 flex-grow">{course.description.substring(0, 100)}...</p>
                                        <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                                            <span>{course.duration}</span>
                                            <span className="capitalize">{course.level}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-lg font-bold text-indigo-400">${course.price.toFixed(2)}</p>
                                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{course.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
                {selectedCourse && <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} onEnroll={handleEnroll} />}
            </div>
        </div>
    );
};

export default StudentCourses;
