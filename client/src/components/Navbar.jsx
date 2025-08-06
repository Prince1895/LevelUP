import React, { useEffect, useState, useContext } from 'react'; // Import useContext
import { HiMenu, HiX } from 'react-icons/hi';
import MagneticButton from "@/components/ui/magnetic-button";
import logo from "@/assets/logo.png";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import AuthContext

const Navbar = () => { // Remove the user and onLogout props
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const navigate = useNavigate(); 

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
    
    
const handleLogout = () => {
    logout();
    navigate('/');
  };
  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/">Home</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/courses">Courses</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/instructor-join">Become Instructor</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/about">About</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/contact">Contact</a></li>
          <li>
            <MagneticButton>
              <a href="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                Log In
              </a>
            </MagneticButton>
          </li>
          <li>
            <MagneticButton>
              <a href="/register" className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-black transition">
                Sign Up
              </a>
            </MagneticButton>
          </li>
        </>
      );
    }

    // Student / Instructor / Admin Role-based links remain the same
    if (user.role === 'student') {
      return (
        <>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/">Home</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/courses">Courses</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/dashboard">My Learning</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/certificates">Certificates</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/admin/profile">My Profile</a></li>
         <li>
 <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
  
    Logout
  </button>


</li>
        </>
      );
    }

    if (user.role === 'instructor') {
      return (
        <>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/instructor/dashboard">Dashboard</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/instructor/courses">My Courses</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/instructor/create">Create Course</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/instructor/earnings">Earnings</a></li>
         <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/admin/profile">My Profile</a></li>
          <li>
    <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
  
    Logout
  </button>

</li>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/admin/dashboard">Admin Panel</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/admin/users">Users</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/admin/approvals">Approvals</a></li>
          <li className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/admin/reports">Reports</a></li>
          <li   className="transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] hover:-translate-y-2"><a href="/profile">My Profile</a></li>
           <li>
   <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
  
    Logout
  </button>

</li>
        </>
      );
    }

    return null;
  };

return (
  <nav
    className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out z-50 backdrop-blur-lg ${
      scrolled
        ? "top-5 rounded-xl bg-white/10 shadow-lg w-full max-w-7xl mx-auto px-4 py-3"
        : "top-0 w-full bg-[black] px-4 py-4"
    }`}
  >

      <div className="max-w-full flex justify-between items-center">
        <div>
          <div className="max-w-full flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="LevelUP Logo"
                className="h-8 w-8 md:h-10 md:w-10"
              />
              <span className="text-xl md:text-2xl font-bold text-white">LevelUP</span>
            </a>
          </div>

        </div>


        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 text-white dark:text-gray-300 font-medium">
          {renderLinks()}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <ul className="md:hidden mt-2 px-4 pt-2 pb-4 bg-black/80 backdrop-blur-md text-white shadow-md space-y-8 rounded-lg flex flex-col">
          {renderLinks()}
        </ul>

      )}
    </nav>
  );
};

export default Navbar;