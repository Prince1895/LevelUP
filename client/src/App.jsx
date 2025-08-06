// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';

// Instructor components
import MyCoursesInstructor from "./components/Dashboard/MyCoursesInstructor";
import CreateCourse from "./components/Dashboard/CreateCourse";
import Earnings from "./components/Dashboard/Earnings";
import Profile from "./components/Dashboard/Profile";

// Admin components
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserManagement from "./components/Dashboard/UserManagement";
import InstructorApprovals from "./components/Dashboard/InstructorApprovals";
import AdminReports from "./components/Dashboard/AdminReports";
import StudentCourses from "./components/Dashboard/StudentCourses";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        
        {/* Common Authenticated Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Instructor Routes */}
        <Route path="/instructor/courses" element={<MyCoursesInstructor />} />
        <Route path="/instructor/create" element={<CreateCourse />} />
        <Route path="/instructor/earnings" element={<Earnings />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/approvals" element={<InstructorApprovals />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/*Student Routes*/}
        <Route path="/student/courses" element={<StudentCourses/>}/>
        
      </Routes>
    </>
  );
};

export default App;
