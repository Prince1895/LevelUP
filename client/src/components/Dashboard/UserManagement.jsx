import React, { useState, useEffect } from 'react';
import API from "@/api/axios";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiUsers, FiUserCheck, FiGrid, FiFileText, FiToggleLeft, FiToggleRight, FiTrash2, FiEye, FiArrowLeft, FiEdit, FiSearch, FiUser } from "react-icons/fi";

// --- Sub-component for viewing an instructor's courses ---
const InstructorCoursesView = ({ instructor, onBack }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                // This endpoint needs to be created on the backend: GET /api/course/instructor/:instructorId
                const response = await API.get(`/course/all?instructor=${instructor._id}`);
                setCourses(response.data.courses);
            } catch (error) {
                console.error(`Failed to fetch courses for ${instructor.name}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, [instructor]);

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm("Admin action: Are you sure you want to delete this course?")) {
            try {
                await API.delete(`/course/delete/${courseId}`);
                setCourses(courses.filter(c => c._id !== courseId));
            } catch (error) {
                console.error("Failed to delete course:", error);
            }
        }
    };

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6">
                <FiArrowLeft /> Back to User Lists
            </button>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">Courses by {instructor.name}</h2>
                {isLoading ? <p>Loading courses...</p> : (
                    <div className="space-y-4">
                        {courses.length > 0 ? courses.map(course => (
                            <div key={course._id} className="bg-[#1a1a1a] p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{course.title}</p>
                                    <p className="text-sm text-gray-400">{course.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="text-green-400 hover:text-green-300"><FiEdit /></button>
                                    <button onClick={() => handleDeleteCourse(course._id)} className="text-red-400 hover:text-red-300"><FiTrash2 /></button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500">This instructor has not created any courses.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main User Management Component ---
const UserManagement = () => {
    const [students, setStudents] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const adminLinks = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
        { label: "User Management", path: "/admin/users", icon: <FiUsers /> },
        { label: "Instructor Approvals", path: "/admin/approvals", icon: <FiUserCheck /> },
        { label: "Reports", path: "/admin/reports", icon: <FiFileText /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            if (!selectedInstructor) { // Only fetch if we are on the main user list view
                setIsLoading(true);
                try {
                    const response = await API.get('/user/');
                    setStudents(response.data.students);
                    setInstructors(response.data.instructors);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUsers();
    }, [selectedInstructor]);

    const handleToggleBlock = async (userId, isBlocked) => {
        const action = isBlocked ? 'unblock' : 'block';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await API.put(`/user/${userId}/${action}`);
                const response = await API.get('/user/');
                setStudents(response.data.students);
                setInstructors(response.data.instructors);
            } catch (error) {
                console.error(`Failed to ${action} user:`, error);
            }
        }
    };
    
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to permanently delete this user?")) {
            try {
                await API.delete(`/user/${userId}`);
                const response = await API.get('/user/');
                setStudents(response.data.students);
                setInstructors(response.data.instructors);
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };

    const UserTable = ({ title, users, onSelectInstructor }) => {
        const [searchTerm, setSearchTerm] = useState('');

        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 rounded-md pl-10 pr-4 py-2 text-sm w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs rounded-full ${user.isBlocked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center gap-4">
                                        {title === 'Instructors' && (
                                            <button onClick={() => onSelectInstructor(user)} className="flex items-center gap-1 text-xs text-indigo-400">
                                                <FiEye/> View Courses
                                            </button>
                                        )}
                                        <button onClick={() => handleToggleBlock(user._id, user.isBlocked)} className={`flex items-center gap-1 text-xs ${user.isBlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {user.isBlocked ? <FiToggleRight/> : <FiToggleLeft/>} {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user._id)} className="flex items-center gap-1 text-xs text-red-400">
                                            <FiTrash2/> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="flex">
            <Sidebar links={adminLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">
                        {selectedInstructor ? 'Instructor Details' : 'User Management'}
                    </h1>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : selectedInstructor ? (
                        <InstructorCoursesView instructor={selectedInstructor} onBack={() => setSelectedInstructor(null)} />
                    ) : (
                        <>
                            <UserTable title="Instructors" users={instructors} onSelectInstructor={setSelectedInstructor} />
                            <UserTable title="Students" users={students} />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default UserManagement;
