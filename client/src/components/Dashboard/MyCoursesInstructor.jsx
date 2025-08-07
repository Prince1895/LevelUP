import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import {
    FiEdit, FiTrash2, FiPlusSquare, FiUsers, FiDollarSign, FiPercent,
    FiBook, FiUser, FiFileText, FiArrowLeft, FiPlus, FiX, FiFilm, FiDownload, FiBarChart2
} from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Navbar from '../Navbar';

// --- Edit Course Modal ---
const EditCourseModal = ({ course, onClose, onCourseUpdate }) => {
    // ... (This component remains the same)
    const [courseDetails, setCourseDetails] = useState({ ...course });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(course.image);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourseDetails(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(courseDetails).forEach(key => {
            formData.append(key, courseDetails[key]);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await API.put(`/course/update/${course._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onCourseUpdate(response.data.course);
            onClose();
        } catch (error) {
            console.error("Failed to update course:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-3xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                 <button onClick={onClose} className="absolute top-4 right-4 text-2xl hover:text-red-500"><FiX /></button>
                <h2 className="text-2xl font-bold mb-6">Edit Course</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={courseDetails.title} onChange={handleChange} placeholder="Course Title" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                    <textarea name="description" value={courseDetails.description} onChange={handleChange} placeholder="Course Description" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 h-24" required />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-auto rounded-lg" />}
                    <input type="file" name="image" onChange={handleImageChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

// --- NEW: Lesson Detail View ---
const LessonDetailView = ({ lesson, quizzes, onBack }) => {
    const [activeTab, setActiveTab] = useState('video');
    const [submissions, setSubmissions] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        if (activeTab === 'analysis' && selectedQuiz) {
            const fetchSubmissions = async () => {
                try {
                    const response = await API.get(`/quiz/quizzes/${selectedQuiz._id}/submissions`);
                    setSubmissions(response.data.submissions);
                } catch (error) {
                    console.error("Failed to fetch submissions:", error);
                }
            };
            fetchSubmissions();
        }
    }, [activeTab, selectedQuiz]);

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{lesson.title}</h3>
                <button onClick={onBack} className="text-sm flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
                    <FiArrowLeft /> Back to Lessons
                </button>
            </div>
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setActiveTab('video')} className={`py-2 px-4 ${activeTab === 'video' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Video</button>
                <button onClick={() => setActiveTab('resources')} className={`py-2 px-4 ${activeTab === 'resources' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Resources</button>
                <button onClick={() => { setActiveTab('analysis'); setSelectedQuiz(quizzes[0] || null); }} className={`py-2 px-4 ${activeTab === 'analysis' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Quiz Analysis</button>
            </div>
            {activeTab === 'video' && (
                lesson.videoUrl ? <video src={lesson.videoUrl} controls className="w-full rounded-lg" /> : <p>No video for this lesson.</p>
            )}
            {activeTab === 'resources' && (
                <div className="space-y-2">
                    {lesson.resources.length > 0 ? lesson.resources.map(res => (
                        <a href={res.url} target="_blank" rel="noopener noreferrer" key={res._id} className="flex items-center justify-between p-3 bg-[#222] rounded-md hover:bg-[#333]">
                            <span className="flex items-center gap-2"><FiFileText /> {res.name}</span>
                            <FiDownload />
                        </a>
                    )) : <p>No resources for this lesson.</p>}
                </div>
            )}
            {activeTab === 'analysis' && (
                <div>
                    <select onChange={(e) => setSelectedQuiz(quizzes.find(q => q._id === e.target.value))} className="bg-neutral-800 p-2 rounded-md mb-4">
                        {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
                    </select>
                    {selectedQuiz ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-2">Student</th>
                                        <th className="p-2">Score</th>
                                        <th className="p-2">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map(sub => (
                                        <tr key={sub._id} className="border-b border-gray-800">
                                            <td className="p-2">{sub.student.name}</td>
                                            <td className="p-2">{sub.score} / {sub.quiz.totalMarks}</td>
                                            <td className="p-2">{((sub.score / sub.quiz.totalMarks) * 100).toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p>No quizzes for this lesson.</p>}
                </div>
            )}
        </div>
    );
};

// --- Course Detail View ---
const CourseDetailView = ({ course: initialCourse, onBack, onCourseUpdate }) => {
    // ... (logic for fetching lessons, quizzes, enrollments remains the same)
    const [course, setCourse] = useState(initialCourse);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState({});
    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('curriculum');
    const [isEditingCourse, setIsEditingCourse] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null); // NEW: state for selected lesson

    useEffect(() => {
        const fetchAllContent = async () => {
            setIsLoading(true);
            try {
                const [lessonsRes, enrollmentsRes] = await Promise.all([
                    API.get(`/lesson/all/${course._id}`),
                    API.get(`/enrollment/course/${course._id}`)
                ]);

                const courseLessons = lessonsRes.data.lessons || [];
                setLessons(courseLessons);
                setEnrollments(enrollmentsRes.data.enrollments || []);

                const quizzesByLesson = {};
                for (const lesson of courseLessons) {
                    const quizRes = await API.get(`/quiz/courses/${course._id}/lessons/${lesson._id}/quizzes`);
                    quizzesByLesson[lesson._id] = quizRes.data.quizzes || [];
                }
                setQuizzes(quizzesByLesson);

            } catch (error) {
                console.error("Failed to fetch course content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllContent();
    }, [course._id]);

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6">
                <FiArrowLeft /> Back to All Courses
            </button>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
                        <p className="text-gray-400 mb-6">{course.category}</p>
                    </div>
                    <img src={course.image} alt={course.title} className="w-48 h-auto rounded-lg" />
                </div>
                
                <div className="flex border-b border-gray-700 mb-6">
                    <button onClick={() => setActiveTab('details')} className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Details</button>
                    <button onClick={() => { setActiveTab('curriculum'); setSelectedLesson(null); }} className={`py-2 px-4 ${activeTab === 'curriculum' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Curriculum</button>
                    <button onClick={() => setActiveTab('students')} className={`py-2 px-4 ${activeTab === 'students' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Students</button>
                    <button onClick={() => setIsEditingCourse(true)} className="py-2 px-4 text-gray-400 hover:text-white">Settings</button>
                </div>

                {isLoading ? <p>Loading...</p> : (
                    <div>
                        {activeTab === 'details' && (
                            <div className="text-white">
                                <h3 className="text-xl font-bold mb-2">Description</h3>
                                <p className="text-gray-400 mb-4">{course.description}</p>
                                <h3 className="text-xl font-bold mb-2">Price</h3>
                                <p className="text-gray-400 mb-4">&#x20B9;{course.price.toFixed(2)}</p>
                                <h3 className="text-xl font-bold mb-2">Category</h3>
                                <p className="text-gray-400">{course.category}</p>
                            </div>
                        )}
                        {activeTab === 'curriculum' && (
                            selectedLesson ? (
                                <LessonDetailView lesson={selectedLesson} quizzes={quizzes[selectedLesson._id]} onBack={() => setSelectedLesson(null)} />
                            ) : (
                                <div className="space-y-4">
                                    {lessons.map(lesson => (
                                        <div key={lesson._id} onClick={() => setSelectedLesson(lesson)} className="cursor-pointer bg-[#1a1a1a] p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    {lesson.thumbnail && <img src={lesson.thumbnail} alt={lesson.title} className="w-24 h-16 object-cover rounded-md" />}
                                                    <h4 className="font-bold text-lg">{lesson.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="hover:text-green-400"><FiEdit /></button>
                                                    <button className="hover:text-red-400"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                        {activeTab === 'students' && (
                           <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.map(enrollment => (
                                            <tr key={enrollment._id} className="border-b border-gray-800 hover:bg-[#1f1f1f]">
                                                <td className="p-4 font-medium">{enrollment.user.name}</td>
                                                <td className="p-4">{enrollment.user.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isEditingCourse && <EditCourseModal course={course} onClose={() => setIsEditingCourse(false)} onCourseUpdate={onCourseUpdate} />}
        </div>
    );
};


// --- Main Component ---
const MyCoursesInstructor = () => {
    // ... (This component's state and logic remains the same)
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
  
    const instructorLinks = [
      { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
      { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
      { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
      { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
      { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];
  
    const fetchInstructorCourses = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await API.get('/course/instructor/my-courses');
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch instructor courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchInstructorCourses();
    }, [user]);
  
    const handleCourseUpdate = (updatedCourse) => {
      setCourses(courses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
      setSelectedCourse(updatedCourse);
    };
  
    return (
      <>
      <Navbar/>
      <div className="flex ">
        <Sidebar links={instructorLinks} />
        <div className="ml-64 w-full flex flex-col min-h-screen">
          <main className="flex-grow bg-[#1a1a1a] text-white p-10">
            <div className="flex justify-between items-center mb-8 pt-10">
              <h1 className="text-3xl font-bold">{selectedCourse ? 'Manage Course' : 'My Courses'}</h1>
              {!selectedCourse && (
                  <Link to="/instructor/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                      <FiPlusSquare /> Create New Course
                  </Link>
              )}
            </div>
  
            {isLoading ? (
              <p className="text-center text-gray-400">Loading your courses...</p>
            ) : selectedCourse ? (
              <CourseDetailView course={selectedCourse} onBack={() => setSelectedCourse(null)} onCourseUpdate={handleCourseUpdate} />
            ) : courses.length === 0 ? (
              <div className="text-center py-10 bg-[#111] border border-gray-800 rounded-lg">
                <p className="text-gray-400 text-lg">You haven't created any courses yet.</p>
                <Link to="/instructor/create" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course._id} onClick={() => setSelectedCourse(course)} className="cursor-pointer bg-[#111] border border-gray-800 rounded-lg shadow-lg hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between">
                    <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-t-lg" />
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
                        <FiDollarSign className="mr-2" /> &#x20B9;{course.price.toFixed(2)}
                      </div>
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