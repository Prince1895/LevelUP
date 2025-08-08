// client/src/components/Dashboard/Earnings.jsx
import React from 'react';
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { FiBook, FiPlusSquare, FiDollarSign, FiUser, FiGrid, FiCheckSquare } from "react-icons/fi";
import Navbar from '../Navbar';

const Earnings = () => {
    const instructorLinks = [
        { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
        { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
        { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
        { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
        { label: "Manage Quizzes", path: "/instructor/quizzes", icon: <FiCheckSquare /> },
        { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiGrid /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    return (
         <>
        <Navbar/>
        <div className="flex">
            <Sidebar links={instructorLinks} />
            <div className="ml-64 w-full flex flex-col min-h-screen">
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <h1 className="text-3xl font-semibold mb-4 pt-10">Earnings</h1>
                    {/* Add your earnings details here */}
                </main>
                <Footer />
            </div>
        </div>
        </>
    );
};

export default Earnings;