// client/src/components/Dashboard/MyCoursesInstructor.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { FiEdit, FiTrash2, FiPlusSquare, FiUsers, FiDollarSign, FiBook, FiUser } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Navbar from '../Navbar';

const MyCoursesInstructor = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define links for the sidebar
  const instructorLinks = [
    { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
    { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
    { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
    { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
    { label: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // Fetches all courses from the backend using the GET /api/course/all route
        const courseRes = await API.get('/course/all');
        
        // This is a client-side filter. Ensure that `user.id` from your AuthContext
        // matches the `course.instructor._id` from your backend.
        const instructorCourses = courseRes.data.courses.filter(c => c.instructor._id === user.id);
        
        // You may want to create a backend route to get enrollments per instructor
        // to make this more efficient.
        const enrollmentRes = await API.get('/enrollment/all');
        const allEnrollments = enrollmentRes.data.enrollments;

        const coursesWithStats = instructorCourses.map(course => {
          const studentCount = allEnrollments.filter(e => e.course._id === course._id).length;
          return { ...course, studentCount };
        });
        
        setCourses(coursesWithStats);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [user]);

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // Deletes a course using the DELETE /api/course/delete/:id route
        await API.delete(`/course/delete/${courseId}`);
        setCourses(courses.filter(c => c._id !== courseId));
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex ">
      <Sidebar links={instructorLinks} />
      <div className="ml-64 w-full flex flex-col min-h-screen">
        <main className="flex-grow bg-[#1a1a1a] text-white p-10">
          <div className="flex justify-between items-center mb-8 pt-10">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <Link to="/instructor/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              <FiPlusSquare /> Create New Course
            </Link>
          </div>

          {isLoading ? (
            <p>Loading your courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course._id} className="bg-[#111] border border-gray-800 rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-white">{course.title}</h2>
                      <span className={`px-3 py-1 text-xs rounded-full ${course.published ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 text-sm">{course.category}</p>
                    <div className="flex items-center text-gray-300 text-sm mb-2">
                      <FiUsers className="mr-2" /> {course.studentCount} Students
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <FiDollarSign className="mr-2" /> ${course.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 px-6 py-3 flex justify-end items-center gap-4">
                    <button className="text-gray-400 hover:text-indigo-400" title="Manage Content"><FiBook /></button>
                    {/* This should link to an edit page or open a modal */}
                    <Link to={`/instructor/course/${course._id}/edit`} className="text-gray-400 hover:text-green-400" title="Edit Course"><FiEdit /></Link>
                    <button onClick={() => handleDelete(course._id)} className="text-gray-400 hover:text-red-400" title="Delete Course"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
    </>
  );
};

export default MyCoursesInstructor;