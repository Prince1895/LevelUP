import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { FiBook, FiPlusSquare, FiDollarSign, FiUser, FiPlus, FiTrash2, FiX, FiCheckSquare, FiSquare, FiUpload } from "react-icons/fi";
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
        if (newQuestions[qIndex].type === 'mcq-single') {
            newQuestions[qIndex].options.forEach((opt, idx) => {
                opt.isCorrect = idx === oIndex;
            });
        } else {
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
                                <div className="flex items-center gap-4">
                                    <select value={q.type} onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)} className="bg-neutral-800 text-xs p-1 rounded-md border border-neutral-700">
                                        <option value="mcq-single">Single Choice</option>
                                        <option value="mcq-multiple">Multiple Choice</option>
                                    </select>
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500"><FiTrash2 /></button>
                                </div>
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
    const [quizzes, setQuizzes] = useState({});

    const [activeTab, setActiveTab] = useState('details');
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [currentLessonForQuiz, setCurrentLessonForQuiz] = useState(null);

    const [courseDetails, setCourseDetails] = useState({
        title: '', description: '', category: '', price: 0, duration: '', level: 'beginner', tags: '', published: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [lessonDetails, setLessonDetails] = useState({
        title: '', content: '', videoUrl: '', duration: '', resources: [{ name: '', type: '', url: '' }]
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    useEffect(() => {
        // Cleanup the object URL to avoid memory leaks
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleLessonChange = (e) => {
        const { name, value } = e.target;
        setLessonDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleResourceChange = (index, e) => {
        const { name, value } = e.target;
        const newResources = [...lessonDetails.resources];
        newResources[index][name] = value;
        setLessonDetails(prev => ({ ...prev, resources: newResources }));
    };

    const addResource = () => {
        setLessonDetails(prev => ({ ...prev, resources: [...prev.resources, { name: '', type: '', url: '' }] }));
    };

    const removeResource = (index) => {
        const newResources = lessonDetails.resources.filter((_, i) => i !== index);
        setLessonDetails(prev => ({ ...prev, resources: newResources }));
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(courseDetails).forEach(key => {
            formData.append(key, courseDetails[key]);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await API.post('/course/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
            setLessonDetails({ title: '', content: '', videoUrl: '', duration: '', resources: [{ name: '', type: '', url: '' }] });
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
                                    <input type="text" name="title" value={courseDetails.title} onChange={handleCourseChange} placeholder="Course Title" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    <textarea name="description" value={courseDetails.description} onChange={handleCourseChange} placeholder="Course Description" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700 h-24" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <select name="category" value={courseDetails.category} onChange={handleCourseChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required>
                                            <option value="" disabled>Select a category</option>
                                            <option value="Web Development">Web Development</option>
                                            <option value="Data Science">Data Science</option>
                                            <option value="UI/UX Design">UI/UX Design</option>
                                            <option value="Business">Business</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Technical">Technical</option>
                                        </select>
                                        <input type="number" name="price" value={courseDetails.price} onChange={handleCourseChange} placeholder="Price (INR)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="duration" value={courseDetails.duration} onChange={handleCourseChange} placeholder="Duration (e.g., 8 hours)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" required />
                                        <select name="level" value={courseDetails.level} onChange={handleCourseChange} className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700">
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="image" className="block text-sm mb-1 text-neutral-300">Course Thumbnail</label>
                                        <input type="file" name="image" id="image" onChange={handleImageChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                        {imagePreview && (
                                            <div className="mt-4">
                                                <img src={imagePreview} alt="Thumbnail Preview" className="w-full max-w-xs h-auto rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                    <input type="text" name="tags" value={courseDetails.tags} onChange={handleCourseChange} placeholder="Tags (comma-separated, e.g., react, nodejs)" className="w-full bg-neutral-800 p-3 rounded-md border border-neutral-700" />
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
                                        
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Resources</h3>
                                            {lessonDetails.resources.map((res, index) => (
                                                <div key={index} className="flex items-center gap-2 mb-2">
                                                    <input type="text" name="name" value={res.name} onChange={(e) => handleResourceChange(index, e)} placeholder="Resource Name" className="w-1/3 bg-neutral-800 p-2 rounded-md border border-neutral-700" />
                                                    <input type="text" name="type" value={res.type} onChange={(e) => handleResourceChange(index, e)} placeholder="Type (e.g., PDF)" className="w-1/3 bg-neutral-800 p-2 rounded-md border border-neutral-700" />
                                                    <input type="text" name="url" value={res.url} onChange={(e) => handleResourceChange(index, e)} placeholder="URL" className="w-1/3 bg-neutral-800 p-2 rounded-md border border-neutral-700" />
                                                    <button type="button" onClick={() => removeResource(index)} className="text-red-500"><FiTrash2 /></button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={addResource} className="text-sm text-indigo-400 flex items-center gap-1"><FiPlus/> Add Resource</button>
                                        </div>

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
