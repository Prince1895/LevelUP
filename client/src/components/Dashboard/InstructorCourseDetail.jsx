import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "@/api/axios";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiEdit, FiTrash2, FiArrowLeft, FiFileText, FiBookOpen, FiUsers } from "react-icons/fi";

const InstructorCourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState({});
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content'); // 'content' or 'students'

    const adminLinks = [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "User Management", path: "/admin/users" },
        { label: "Instructor Approvals", path: "/admin/approvals" },
        { label: "Reports", path: "/admin/reports" },
    ];

    useEffect(() => {
        const fetchCourseData = async () => {
            setIsLoading(true);
            try {
                const courseRes = await API.get(`/course/by-id/${courseId}`);
                setCourse(courseRes.data.course);

                const lessonsRes = await API.get(`/lesson/all/${courseId}`);
                const courseLessons = lessonsRes.data.lessons || [];
                setLessons(courseLessons);

                const quizzesByLesson = {};
                for (const lesson of courseLessons) {
                    const quizRes = await API.get(`/quiz/courses/${courseId}/lessons/${lesson._id}/quizzes`);
                    quizzesByLesson[lesson._id] = quizRes.data.quizzes || [];
                }
                setQuizzes(quizzesByLesson);

                const enrollmentsRes = await API.get(`/enrollment/course/${courseId}`);
                setEnrolledStudents(enrollmentsRes.data.enrollments);

            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    return (
        <div className="flex">
            <Sidebar links={adminLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6">
                        <FiArrowLeft /> Back
                    </button>
                    {isLoading ? <p>Loading course details...</p> : course && (
                        <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                                    <p className="text-gray-400">by {course.instructor.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="text-green-400 hover:text-green-300"><FiEdit /> Edit Course</button>
                                    <button className="text-red-400 hover:text-red-300"><FiTrash2 /> Delete Course</button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-700 mb-6">
                                <button onClick={() => setActiveTab('content')} className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'content' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}><FiBookOpen/> Course Content</button>
                                <button onClick={() => setActiveTab('students')} className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'students' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}><FiUsers/> Enrolled Students</button>
                            </div>

                            {activeTab === 'content' && (
                                <div className="space-y-4">
                                    {lessons.map(lesson => (
                                        <div key={lesson._id} className="bg-[#1a1a1a] p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-lg">{lesson.title}</h3>
                                                <div className="flex items-center gap-3">
                                                    <button className="hover:text-green-400"><FiEdit /></button>
                                                    <button className="hover:text-red-400"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                            <div className="pl-4 mt-3">
                                                {quizzes[lesson._id]?.map(quiz => (
                                                    <div key={quiz._id} className="flex justify-between items-center bg-[#2a2a2a] p-2 rounded-md mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <FiFileText className="text-indigo-400"/>
                                                            <span className="text-sm font-medium text-gray-300">{quiz.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <button className="hover:text-green-400"><FiEdit /></button>
                                                            <button className="hover:text-red-400"><FiTrash2 /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'students' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="p-4">Student Name</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {enrolledStudents.map(enrollment => (
                                                <tr key={enrollment._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                                                    <td className="p-4 font-medium">{enrollment.user.name}</td>
                                                    <td className="p-4">{enrollment.user.email}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 text-xs rounded-full ${enrollment.user.isBlocked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                                            {enrollment.user.isBlocked ? 'Blocked' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <button className="text-red-400 text-xs">Remove from Course</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default InstructorCourseDetail;
