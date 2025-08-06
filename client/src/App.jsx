// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';

// Import the new instructor components
import MyCoursesInstructor from "./components/Dashboard/MyCoursesInstructor";
import CreateCourse from "./components/Dashboard/CreateCourse";
import Earnings from "./components/Dashboard/Earnings";
import Profile from "./components/Dashboard/Profile";


const App = () => {
  return (
    <>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Added Instructor Routes */}
        <Route path="/instructor/courses" element={<MyCoursesInstructor />} />
        <Route path="/instructor/create" element={<CreateCourse />} />
        <Route path="/instructor/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;