import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { FiBook, FiPlusSquare, FiDollarSign, FiUser, FiPlus, FiTrash2, FiX, FiCheckSquare, FiSquare } from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from '../Navbar';

// Modal for creating a new quiz
const QuizModal = ({ courseId, lessonId, onClose, onQuizCreated }) => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', options: [{ text: '', isCorrect: false }], type: 'mcq-single' }]);

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex][field] = value;
        setQuestions(newQuestions);
    };
    
    const handleCorrectOptionChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // For single choice, unselect other options
        if (newQuestions[qIndex].type === 'mcq-single') {
            newQuestions[qIndex].options.forEach((opt, idx) => {
                opt.isCorrect = idx === oIndex;
            });
        } else { // For multiple choice, just toggle
            newQuestions[qIndex].options[oIndex].isCorrect = !newQuestions[qIndex].options[oIndex].isCorrect;
        }
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: [{ text: '', isCorrect: false }], type: 'mcq-single' }]);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', isCorrect: false });
        setQuestions(newQuestions);
    };
    
    const removeQuestion = (qIndex) => {
        setQuestions(questions.filter((_, index) => index !== qIndex));
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== oIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const quizData = { title, questions };
            const response = await API.post(`/quiz/courses/${courseId}/lessons/${lessonId}/quizzes`, quizData);
            onQuizCreated(response.data.quiz);
            onClose();
        } catch (error) {
            console.error("Failed to create quiz:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-3xl border border-gray-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create New Quiz</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500"><FiX /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                    
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-[#111] p-4 rounded-lg border border-gray-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Question {qIndex + 1}</h3>
                                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500"><FiTrash2 /></button>
                            </div>
                            <textarea value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)} placeholder="Question Text" className="w-full bg-neutral-800 p-2 rounded-md border border-neutral-700" required />
                            
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                    <button type="button" onClick={() => handleCorrectOptionChange(qIndex, oIndex)}>
                                        {opt.isCorrect ? <FiCheckSquare className="text-green-400" /> : <FiSquare className="text-gray-500" />}
                                    </button>
                                    <input type="text" value={opt.text} onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)} placeholder={`Option ${oIndex + 1}`} className="flex-grow bg-neutral-800 p-2 rounded-md border border-neutral-700" required />
                                    <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-red-500 text-xs"><FiTrash2/></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addOption(qIndex)} className="text-sm text-indigo-400 flex items-center gap-1"><FiPlus/> Add Option</button>
                        </div>
                    ))}
                    
                    <button type="button" onClick={addQuestion} className="px-4 py-2 text-sm rounded-md border border-dashed border-gray-600 hover:bg-gray-700 transition flex items-center gap-2"><FiPlus /> Add Question</button>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition">Save Quiz</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CreateCourse = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState({}); // { lessonId: [quiz1, quiz2] }

    const [activeTab, setActiveTab] = useState('details');
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [currentLessonForQuiz, setCurrentLessonForQuiz] = useState(null);

    const [courseDetails, setCourseDetails] = useState({
        title: '', description: '', category: '', price: 0, duration: '', level: 'beginner', image: '', published: false
    });

    const [lessonDetails, setLessonDetails] = useState({
        title: '', content: '', videoUrl: '', duration: ''
    });

    const instructorLinks = [
        { label: "Dashboard", path: "/dashboard", icon: <FiBook /> },
        { label: "My Courses", path: "/instructor/courses", icon: <FiBook /> },
        { label: "Create Course", path: "/instructor/create", icon: <FiPlusSquare /> },
        { label: "Earnings", path: "/instructor/earnings", icon: <FiDollarSign /> },
        { label: "Profile", path: "/profile", icon: <FiUser /> },
    ];

    const handleCourseChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourseDetails(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleLessonChange = (e) => {
        const { name, value } = e.target;
        setLessonDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/course/create', courseDetails);
            setCourse(response.data.course);
            setActiveTab('lessons');
        } catch (error) {
            console.error("Failed to create course:", error);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!course) return;
        try {
            const response = await API.post(`/lesson/create/${course._id}`, lessonDetails);
            const newLesson = response.data.lesson;
            setLessons([...lessons, newLesson]);
            setQuizzes(prev => ({...prev, [newLesson._id]: []}));
            setLessonDetails({ title: '', content: '', videoUrl: '', duration: '' });
        } catch (error) {
            console.error("Failed to add lesson:", error);
        }
    };

    const handleAddQuizClick = (lessonId) => {
        setCurrentLessonForQuiz(lessonId);
        setIsQuizModalOpen(true);
    };

    const handleQuizCreated = (newQuiz) => {
        setQuizzes(prev => ({
            ...prev,
            [newQuiz.lesson]: [...(prev[newQuiz.lesson] || []), newQuiz]
        }));
    };

    return (
        <>
            <Navbar/>
            <div className="flex">
                <Sidebar links={instructorLinks} />
                <div className="ml-64 w-full flex flex-col min-h-screen">
                    <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                        <h1 className="text-3xl font-semibold mb-4 pt-10">Create a New Course</h1>
                        <div className="w-full max-w-4xl mx-auto">
                            <div className="flex border-b border-gray-700 mb-6">
                                <button onClick={() => setActiveTab('details')} className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'}`}>Course Details</button>
                                <button onClick={() => setActiveTab('lessons')} disabled={!course} className={`py-2 px-4 ${activeTab === 'lessons' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'} disabled:opacity-50`}>Add Lessons</button>
                                <button onClick={() => setActiveTab('quizzes')} disabled={!course || lessons.length === 0} className={`py-2 px-4 ${activeTab === 'quizzes' ? 'border-b-2 border-indigo-500 text-white' : 'text-gray-400'} disabled:opacity-50`}>Add Quizzes</button>
                            </div>

                            {activeTab === 'details' && (
                                <form onSubmit={handleCreateCourse} className="space-y-4">
                                    {/* Course Details Form Inputs */}
                                    <input type="text" name="title" value={courseDetails.title} onChange={handleCourseChange} placeholder="Course Title" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    <textarea name="description" value={courseDetails.description} onChange={handleCourseChange} placeholder="Course Description" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 h-24" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="category" value={courseDetails.category} onChange={handleCourseChange} placeholder="Category" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                        <input type="number" name="price" value={courseDetails.price} onChange={handleCourseChange} placeholder="Price (USD)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="duration" value={courseDetails.duration} onChange={handleCourseChange} placeholder="Duration (e.g., 8 hours)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                        <select name="level" value={courseDetails.level} onChange={handleCourseChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700">
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <input type="text" name="image" value={courseDetails.image} onChange={handleCourseChange} placeholder="Image URL" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" />
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" name="published" checked={courseDetails.published} onChange={handleCourseChange} id="published" className="h-5 w-5" />
                                        <label htmlFor="published">Publish this course?</label>
                                    </div>
                                    <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition">Save and Continue</button>
                                </form>
                            )}

                            {activeTab === 'lessons' && (
                                <div>
                                    <form onSubmit={handleAddLesson} className="space-y-4 bg-[#111] p-6 rounded-lg border border-gray-800 mb-6">
                                        <h2 className="text-xl font-bold">Add a New Lesson</h2>
                                        <input type="text" name="title" value={lessonDetails.title} onChange={handleLessonChange} placeholder="Lesson Title" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                        <textarea name="content" value={lessonDetails.content} onChange={handleLessonChange} placeholder="Lesson Content" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 h-24" required />
                                        <input type="text" name="videoUrl" value={lessonDetails.videoUrl} onChange={handleLessonChange} placeholder="Video URL" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" />
                                        <input type="text" name="duration" value={lessonDetails.duration} onChange={handleLessonChange} placeholder="Duration (e.g., 15 mins)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" />
                                        <button type="submit" className="px-6 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2"><FiPlus /> Add Lesson</button>
                                    </form>
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Course Lessons</h3>
                                        {lessons.map((lesson) => (
                                            <div key={lesson._id} className="bg-[#111] p-4 rounded-lg border border-gray-800 mb-2 flex justify-between items-center">
                                                <p>{lesson.title}</p>
                                                <button className="text-red-500"><FiTrash2 /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'quizzes' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Add Quizzes to Lessons</h2>
                                    {lessons.map((lesson) => (
                                        <div key={lesson._id} className="bg-[#111] p-4 rounded-lg border border-gray-800 mb-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold">{lesson.title}</h3>
                                                <button onClick={() => handleAddQuizClick(lesson._id)} className="px-4 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2"><FiPlus /> Add Quiz</button>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-400">
                                                {quizzes[lesson._id]?.map(quiz => <div key={quiz._id}>- {quiz.title}</div>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
            {isQuizModalOpen && <QuizModal courseId={course._id} lessonId={currentLessonForQuiz} onClose={() => setIsQuizModalOpen(false)} onQuizCreated={handleQuizCreated} />}
        </>
    );
};

export default CreateCourse;
