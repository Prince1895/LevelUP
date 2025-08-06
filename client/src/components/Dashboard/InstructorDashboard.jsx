import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import API from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import { FiBook, FiPlusSquare, FiDollarSign, FiUser, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

// A modal component for creating/editing a course
const CourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    price: course?.price || 0,
    duration: course?.duration || '',
    published: course?.published || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">{course ? 'Edit Course' : 'Create New Course'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Course Description" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 h-24" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Web Development)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (USD)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
          </div>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (e.g., 8 hours)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
          <div className="flex items-center gap-3">
            <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} id="published" className="h-5 w-5" />
            <label htmlFor="published">Publish this course immediately?</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition">Save Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ courses: 0, students: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const instructorLinks = [
    { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
    { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
    { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
    { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
    { label: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Assuming you have an endpoint to get courses by instructor
        const response = await API.get('/course/all'); // Adjust if you have a specific instructor route
        // Filter courses that belong to the current instructor
        const instructorCourses = response.data.courses.filter(course => course.instructor._id === user.id);
        setCourses(instructorCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await API.delete(`/course/delete/${courseId}`);
        setCourses(courses.filter(c => c._id !== courseId));
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  const handleSaveCourse = async (formData) => {
    try {
      if (editingCourse) {
        // Update existing course
        const response = await API.put(`/course/update/${editingCourse._id}`, formData);
        setCourses(courses.map(c => c._id === editingCourse._id ? response.data.course : c));
      } else {
        // Create new course
        const response = await API.post('/course/create', formData);
        setCourses([...courses, response.data.course]);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar links={instructorLinks} />
      <div className="ml-64 w-full flex flex-col min-h-screen">
        <main className="flex-grow bg-[#1a1a1a] text-white p-10">
          <div className="flex justify-between items-center mb-8 pt-10">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Instructor'}! 👋</h1>
            <button onClick={handleCreateCourse} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              <FiPlusSquare /> Create New Course
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Courses</h3>
              <p className="text-4xl font-bold">{courses.length}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Students</h3>
              <p className="text-4xl font-bold">{stats.students}</p>
            </div>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-gray-400">Total Revenue</h3>
              <p className="text-4xl font-bold">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>

          {/* My Courses Table */}
          <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center p-4">Loading courses...</td></tr>
                  ) : courses.map(course => (
                    <tr key={course._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                      <td className="p-4 font-medium">{course.title}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs rounded-full ${course.published ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">${course.price.toFixed(2)}</td>
                      <td className="p-4 flex items-center gap-3">
                        <button onClick={() => handleEditCourse(course)} className="text-gray-400 hover:text-indigo-400"><FiEdit /></button>
                        <button onClick={() => handleDeleteCourse(course._id)} className="text-gray-400 hover:text-red-400"><FiTrash2 /></button>
                        <button className="text-gray-400 hover:text-blue-400"><FiEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {isModalOpen && <CourseModal course={editingCourse} onClose={() => setIsModalOpen(false)} onSave={handleSaveCourse} />}
    </div>
  );
};

export default InstructorDashboard;