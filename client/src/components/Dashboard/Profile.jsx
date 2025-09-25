import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import API from '@/api/axios';
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { 
    FiUser, FiEdit3, FiLock, FiSave, FiBookOpen, 
    FiAward, FiSettings, FiPlusSquare, FiDollarSign, 
    FiGrid, FiUsers, FiUserCheck, FiFileText, FiX, FiBook,
    FiCheckSquare
} from "react-icons/fi";

// --- Update Profile Modal ---
const UpdateProfileModal = ({ user, onClose, onProfileUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const handleSubmit = (e) => {
        e.preventDefault();
        onProfileUpdate({ name, email });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-md border border-gray-700 relative">
                <button onClick={onClose} className="absolute top-4 text-white right-4 text-2xl hover:text-red-500"><FiX /></button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="text-white space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm mb-1 text-neutral-300">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-neutral-800 p-3 rounded-md border placeholder:text-gray-500 border-neutral-700" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1 text-neutral-300">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-neutral-800 p-3 rounded-md border placeholder:text-gray-500 border-neutral-700" required />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition flex items-center placeholder:text-gray-500 justify-center gap-2">
                        <FiSave /> Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Change Password Modal ---
const ChangePasswordModal = ({ onClose, onPasswordUpdate }) => {
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onPasswordUpdate(passwordData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-md border border-gray-700 relative">
                <button onClick={onClose} className="absolute top-4 text-white right-4 text-2xl hover:text-red-500"><FiX /></button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Change Password</h2>
                <form onSubmit={handleSubmit} className="text-white space-y-4">
                    <div>
                        <label htmlFor="oldPassword">Current Password</label>
                        <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handleChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 placeholder:text-gray-500" required />
                    </div>
                    <div>
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handleChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 placeholder:text-gray-500" required />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 placeholder:text-gray-500 " required />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition flex items-center justify-center gap-2">
                        <FiSave /> Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- Main Profile Component ---
const Profile = () => {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Role-based sidebar links
    const getSidebarLinks = (role) => {
        switch (role) {
            case 'student':
                return [
                    { label: "My Learning", path: "/dashboard", icon: <FiBookOpen /> },
                    { label: "Browse Courses", path: "/student/courses", icon: <FiBookOpen /> },
                    { label: "Certificates", path: "/student/certificates", icon: <FiAward /> },
                    { label: "Profile", path: "/profile", icon: <FiUser /> },
                ];
            case 'instructor':
                return [
                    { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
                    { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
                    { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
                    { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
                    { label: "Manage Quizzes", path: "/instructor/quizzes", icon: <FiCheckSquare /> },
                    { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiGrid /> },
                    { label: "Profile", path: "/profile", icon: <FiUser /> },
                ];
            case 'admin':
                return [
                    { label: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
                    { label: "User Management", path: "/admin/users", icon: <FiUsers /> },
                    { label: "Instructor Approvals", path: "/admin/approvals", icon: <FiUserCheck /> },
                    { label: "Reports", path: "/admin/reports", icon: <FiFileText /> },
                    { label: "Manage Marketplace", path: "/manage-marketplace", icon: <FiGrid /> },
                    { label: "Profile", path: "/profile", icon: <FiUser /> },
                ];
            default:
                return [];
        }
    };
    const sidebarLinks = getSidebarLinks(user?.role);

    const handleProfileUpdate = async (profileData) => {
        setMessage({ type: '', text: '' });
        try {
            const response = await API.put('/user/profile', profileData);
            const updatedUser = { ...user, ...response.data.user };
            login(updatedUser, localStorage.getItem('token'));
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setProfileModalOpen(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        }
    };

    const handlePasswordUpdate = async (passwordData) => {
        setMessage({ type: '', text: '' });
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        try {
            await API.put('/user/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed! Redirecting to login...' });
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex">
                <Sidebar links={sidebarLinks} />
                <div className="ml-64 w-full flex flex-col min-h-screen">
                    <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                        <h1 className="text-3xl font-semibold mb-8 pt-10">My Profile</h1>
                        
                        {message.text && (
                            <div className={`p-4 rounded-md mb-6 text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="max-w-2xl text-white  mx-auto bg-[#111] p-8 rounded-lg border border-gray-800 text-center">
                            <div className="w-24 h-24 rounded-full bg-indigo-500 mx-auto flex items-center justify-center text-4xl font-bold mb-4">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                            <p className="text-gray-400 mt-1">{user?.email}</p>
                            <p className="text-sm mt-1 capitalize bg-gray-700 inline-block  px-3 py-1 rounded-full">{user?.role}</p>

                            <div className="mt-8 flex justify-center gap-4">
                                <button onClick={() => setProfileModalOpen(true)} className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition flex items-center gap-2">
                                    <FiEdit3 /> Update Profile
                                </button>
                                <button onClick={() => setPasswordModalOpen(true)} className="py-2 px-5 bg-neutral-700 hover:bg-neutral-600 rounded-md font-medium transition flex items-center gap-2">
                                    <FiLock /> Change Password
                                </button>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>

            {isProfileModalOpen && <UpdateProfileModal user={user} onClose={() => setProfileModalOpen(false)} onProfileUpdate={handleProfileUpdate} />}
            {isPasswordModalOpen && <ChangePasswordModal onClose={() => setPasswordModalOpen(false)} onPasswordUpdate={handlePasswordUpdate} />}
        </>
    );
};

export default Profile;
