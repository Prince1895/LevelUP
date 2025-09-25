import React, { useState, useEffect } from 'react';
import API from "@/api/axios";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiUsers, FiUserCheck, FiGrid, FiFileText, FiCheckCircle, FiUser } from "react-icons/fi";

const InstructorApprovals = () => {
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
        const fetchPendingInstructors = async () => {
            setIsLoading(true);
            try {
                const response = await API.get('/user/');
                const pending = response.data.instructors.filter(inst => !inst.isApproved);
                setPendingInstructors(pending);
            } catch (error) {
                console.error("Failed to fetch pending instructors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPendingInstructors();
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

    return (
        <div className="flex">
            <Sidebar links={adminLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-8 pt-10">Instructor Approvals</h1>
                    <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                        <h2 className="text-2xl font-bold mb-4">Pending Approvals</h2>
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
                                    ) : pendingInstructors.length > 0 ? (
                                        pendingInstructors.map(inst => (
                                            <tr key={inst._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                                                <td className="p-4 font-medium">{inst.name}</td>
                                                <td className="p-4">{inst.email}</td>
                                                <td className="p-4">
                                                    <button onClick={() => handleApproveInstructor(inst._id)} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-green-500/40">
                                                        <FiCheckCircle/> Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="3" className="text-center p-4 text-gray-500">No pending approvals.</td></tr>
                                    )}
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

export default InstructorApprovals;
