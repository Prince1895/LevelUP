import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import API from '@/api/axios';

// Role-based dashboards
import StudentDashboard from '@/components/Dashboard/StudentDashboard.jsx';
import InstructorDashboard from '@/components/Dashboard/InstructorDashboard.jsx';
import AdminDashboard from '@/components/Dashboard/AdminDashboard.jsx';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/me', { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
      <Navbar user={user} setUser={setUser} />
      {loading ? (
        <div className="text-center mt-10 text-white">Loading dashboard...</div>
      ) : (
        renderDashboard()
      )}
      <Footer />
    </>
  );
};

export default Dashboard;
