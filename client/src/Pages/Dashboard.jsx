import React, { useContext } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

// Role-based dashboards
import StudentDashboard from '@/components/Dashboard/StudentDashboard.jsx';
import InstructorDashboard from '@/components/Dashboard/InstructorDashboard.jsx';
import AdminDashboard from '@/components/Dashboard/AdminDashboard.jsx';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext); // Get user and loading state from context

  const renderDashboard = () => {
    if (!user) return <div className="text-center text-red-500 mt-10">Unauthorized. Please log in.</div>;

    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div className="text-center text-yellow-500 mt-10">Unknown role</div>;
    }
  };

  return (
    <>
      
      {loading ? (
        <div className="text-center mt-10 text-white">Loading dashboard...</div>
      ) : (
        renderDashboard()
      )}
      
    </>
  );
};

export default Dashboard;