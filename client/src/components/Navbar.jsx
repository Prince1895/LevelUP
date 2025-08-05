import React, { useEffect, useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom'; // ✅ Import Link
import MagneticButton from "@/components/ui/magnetic-button";
import logo from "@/assets/logo.png";
import API from "@/api/axios";

const Navbar = ({ user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/instructor-join">Become Instructor</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li>
            <MagneticButton>
              <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                Log In
              </Link>
            </MagneticButton>
          </li>
          <li>
            <MagneticButton>
              <Link to="/register" className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-black transition">
                Sign Up
              </Link>
            </MagneticButton>
          </li>
        </>
      );
    }

    const commonProfileDropdown = (
      <li className="relative group">
        <button className="group-hover:text-blue-400">Profile ▼</button>
        <ul className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg mt-2 p-2 rounded-lg z-50">
          <li><Link to="/profile" className="block px-4 py-2">My Profile</Link></li>
          <li><button onClick={handleLogout} className="block px-4 py-2 text-red-500">Logout</button></li>
        </ul>
      </li>
    );

    if (user.role === 'student') {
      return (
        <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/my-learning">My Learning</Link></li>
          <li><Link to="/certificates">Certificates</Link></li>
          {commonProfileDropdown}
        </>
      );
    }

    if (user.role === 'instructor') {
      return (
        <>
          <li><Link to="/instructor/dashboard">Dashboard</Link></li>
          <li><Link to="/instructor/courses">My Courses</Link></li>
          <li><Link to="/instructor/create">Create Course</Link></li>
          <li><Link to="/instructor/earnings">Earnings</Link></li>
          {commonProfileDropdown}
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <li><Link to="/admin">Admin Panel</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/approvals">Approvals</Link></li>
          <li><Link to="/admin/reports">Reports</Link></li>
          {commonProfileDropdown}
        </>
      );
    }

    return null;
  };

  return (
    <nav className={`fixed left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-lg transition-all duration-300 ease-in-out ${
      scrolled ? 'top-5 rounded-xl bg-white/10 shadow-lg w-full max-w-7xl mx-auto px-4 py-3' : 'top-0 w-full bg-transparent px-4 py-4'
    }`}>
      <div className="max-w-full flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="LevelUP Logo" className="h-8 w-8 md:h-10 md:w-10" />
          <span className="text-xl md:text-2xl font-bold text-white">LevelUP</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-white dark:text-gray-300 font-medium">
          {renderLinks()}
        </ul>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white text-2xl focus:outline-none">
          {mobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <ul className="md:hidden mt-2 px-4 pt-2 pb-4 bg-black/80 backdrop-blur-md text-white shadow-md space-y-8 rounded-lg flex flex-col">
          {renderLinks()}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
