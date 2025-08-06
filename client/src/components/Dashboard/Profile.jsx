import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '@/context/AuthContext';
import API from '@/api/axios';
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';
import { FiBook, FiPlusSquare, FiDollarSign, FiUser, FiEdit3, FiLock, FiSave } from "react-icons/fi";

const Profile = () => {
    const { user, login, logout } = useContext(AuthContext); // Get logout function from context
    const navigate = useNavigate(); // Initialize navigate

    // State for the profile update form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // State for the password change form
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // State for UI feedback
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Sidebar links (can be dynamic based on user role)
    const instructorLinks = [
        { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
        { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
        { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
        { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: '', text: '' });

        try {
            const response = await API.put('/user/profile', profileData);
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Update the user in AuthContext
            login(response.data.user, localStorage.getItem('token')); 
        } catch (error) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            await API.put('/user/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            
            // Set success message and then redirect
            setPasswordMessage({ type: 'success', text: 'Password changed successfully! Redirecting to login...' });
            
            // Wait a moment for the user to see the message
            setTimeout(() => {
                logout(); // This will clear the user state in the context
                localStorage.removeItem('token'); // Explicitly remove the token
                localStorage.removeItem('user'); // Also remove the user data
                navigate('/login'); // Redirect to the login page
            }, 2000);

        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex">
                <Sidebar links={instructorLinks} />
                <div className="ml-64 w-full flex flex-col min-h-screen">
                    <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                        <h1 className="text-3xl font-semibold mb-8 pt-10">My Profile</h1>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Profile Information Form */}
                            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiEdit3 /> Edit Profile</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm mb-1 text-neutral-300">Full Name</label>
                                        <input type="text" id="name" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm mb-1 text-neutral-300">Email Address</label>
                                        <input type="email" id="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    {profileMessage.text && (
                                        <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{profileMessage.text}</p>
                                    )}
                                    <button type="submit" className="w-full py-2 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition flex items-center justify-center gap-2">
                                        <FiSave /> Save Changes
                                    </button>
                                </form>
                            </div>

                            {/* Change Password Form */}
                            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiLock /> Change Password</h2>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div>
                                        <label htmlFor="oldPassword"  className="block text-sm mb-1 text-neutral-300">Current Password</label>
                                        <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword"  className="block text-sm mb-1 text-neutral-300">New Password</label>
                                        <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword"  className="block text-sm mb-1 text-neutral-300">Confirm New Password</label>
                                        <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    {passwordMessage.text && (
                                        <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{passwordMessage.text}</p>
                                    )}
                                    <button type="submit" className="w-full py-2 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition flex items-center justify-center gap-2">
                                        <FiSave /> Update Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Profile;
