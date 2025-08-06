import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { 
    FiEdit, FiTrash2, FiPlusSquare, FiUsers, FiDollarSign, 
    FiBook, FiUser, FiFileText, FiArrowLeft, FiPlus
} from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Navbar from '../Navbar';

// --- Detailed Quiz View ---
const QuizDetails = ({ quiz }) => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await API.get(`/quiz/quizzes/${quiz._id}/submissions`);
                setSubmissions(res.data.submissions);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, [quiz._id]);

    const averageScore = submissions.length > 0
        ? (submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length).toFixed(2)
        : 0;
    
    const highestScore = submissions.length > 0 
        ? Math.max(...submissions.map(sub => sub.score))
        : 0;

    if (isLoading) return <p className="text-xs text-gray-400 p-2">Loading quiz stats...</p>;

    return (
        <div className="bg-[#1f1f1f] p-4 mt-2 rounded-lg space-y-4">
            <div className="flex justify-around text-center text-sm text-gray-300 bg-[#2a2a2a] p-3 rounded-md">
                <div><p className="font-bold text-lg">{submissions.length}</p><p>Submissions</p></div>
                <div><p className="font-bold text-lg">{averageScore}</p><p>Avg. Score</p></div>
                <div><p className="font-bold text-lg">{highestScore}</p><p>Highest Score</p></div>
            </div>
            {quiz.questions.map((q, index) => (
                <div key={index} className="text-sm border-t border-gray-700 pt-3">
                    <p className="font-semibold text-gray-200">{index + 1}. {q.questionText}</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        {q.options.map((opt, oIndex) => (
                            <li key={oIndex} className={opt.isCorrect ? 'text-green-400 font-medium' : 'text-gray-400'}>{opt.text}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

// --- Course Detail View ---
const CourseDetailView = ({ course, onBack, onCourseUpdate }) => {
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            try {
                const lessonsRes = await API.get(`/lesson/all/${course._id}`);
                const courseLessons = lessonsRes.data.lessons || [];
                setLessons(courseLessons);

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
        fetchContent();
    }, [course._id]);

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6">
                <FiArrowLeft /> Back to All Courses
            </button>
            <div className="bg-[#111] p-6 rounded-lg border border-gray-800">
                <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
                <p className="text-gray-400 mb-6">{course.category}</p>
                
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Lessons & Quizzes</h3>
                {isLoading ? <p>Loading content...</p> : (
                    <div className="space-y-4">
                        {lessons.map(lesson => (
                            <div key={lesson._id} className="bg-[#1a1a1a] p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-lg">{lesson.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <button className="hover:text-green-400"><FiEdit /></button>
                                        <button className="hover:text-red-400"><FiTrash2 /></button>
                                    </div>
                                </div>
                                <div className="pl-4 mt-3">
                                    {quizzes[lesson._id]?.map(quiz => <QuizDetails key={quiz._id} quiz={quiz} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Component ---
const MyCoursesInstructor = () => {
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

  useEffect(() => {
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
    fetchInstructorCourses();
  }, [user]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
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
            <CourseDetailView course={selectedCourse} onBack={() => setSelectedCourse(null)} />
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
                <div key={course._id} onClick={() => handleCourseSelect(course)} className="cursor-pointer bg-[#111] border border-gray-800 rounded-lg shadow-lg hover:border-indigo-500 transition-all duration-300 flex flex-col justify-between">
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
