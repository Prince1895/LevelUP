import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import { FiPlayCircle, FiFileText, FiDownload, FiCheckSquare, FiXSquare, FiBarChart2, FiClock, FiRefreshCw } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ContinueLearning = () => {
    const { courseId } = useParams();
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [quizzes, setQuizzes] = useState({});
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [enrollment, setEnrollment] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!user) return;
            try {
                const courseRes = await API.get(`/course/by-id/${courseId}`);
                setCourse(courseRes.data.course);

                const lessonsRes = await API.get(`/lesson/all/${courseId}`);
                const lessonsData = lessonsRes.data.lessons;
                setLessons(lessonsData);
                if (lessonsData.length > 0) {
                    setSelectedLesson(lessonsData[0]);
                }

                const quizzesByLesson = {};
                for (const lesson of lessonsData) {
                    const quizRes = await API.get(`/quiz/courses/${courseId}/lessons/${lesson._id}/quizzes`);
                    quizzesByLesson[lesson._id] = quizRes.data.quizzes;
                }
                setQuizzes(quizzesByLesson);

                const enrollmentRes = await API.get('/enrollment/my');
                const currentEnrollment = enrollmentRes.data.enrollments.find(e => e.course?._id === courseId);
                if (currentEnrollment) {
                    setEnrollment(currentEnrollment);
                    setCompletedLessons(new Set(currentEnrollment.completedLessons));
                }

            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, user]);

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
    };

    const handleLessonComplete = async (lessonId) => {
        if (completedLessons.has(lessonId)) return;

        const newCompletedLessons = new Set(completedLessons).add(lessonId);
        setCompletedLessons(newCompletedLessons);

        try {
            await API.post('/enrollment/complete-lesson', { courseId, lessonId });
        } catch (error) {
            console.error("Failed to mark lesson as complete:", error);
            const revertedCompletedLessons = new Set(completedLessons);
            revertedCompletedLessons.delete(lessonId);
            setCompletedLessons(revertedCompletedLessons);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1overflow-hidden">
                <aside className="w-1/4 bg-[#111] p-10 text-white h-full overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4 ">{course?.title}</h2>
                    <ul>
                        {lessons.map(lesson => (
                            <li key={lesson._id} onClick={() => handleSelectLesson(lesson)} className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${selectedLesson?._id === lesson._id ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}>
                                {lesson.title}
                                {completedLessons.has(lesson._id) && <FiCheckSquare className="text-green-400" />}
                            </li>
                        ))}
                    </ul>
                </aside>
                <div className="w-full flex flex-col min-h-screen">
                    <main className="flex-grow bg-[#1a1a1a] text-white p-10 overflow-y-auto">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : selectedLesson ? (
                            <LessonView
                                lesson={selectedLesson}
                                quizzes={quizzes[selectedLesson._id] || []}
                                onLessonComplete={handleLessonComplete}
                                isLessonCompleted={completedLessons.has(selectedLesson._id)}
                            />
                        ) : (
                            <p>Select a lesson to begin.</p>
                        )}
                    </main>
                    <Footer />
                </div>
                
            </div>
        </div>
    );
};

const LessonView = ({ lesson, quizzes, onLessonComplete, isLessonCompleted }) => {
    const [activeTab, setActiveTab] = useState('video');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setActiveTab('video')} className={`py-2 px-4 ${activeTab === 'video' ? 'border-b-2 border-indigo-500' : ''}`}>Video</button>
                <button onClick={() => setActiveTab('resources')} className={`py-2 px-4 ${activeTab === 'resources' ? 'border-b-2 border-indigo-500' : ''}`}>Resources</button>
                <button onClick={() => setActiveTab('quiz')} className={`py-2 px-4 ${activeTab === 'quiz' ? 'border-b-2 border-indigo-500' : ''}`}>Quiz</button>
            </div>
            <div>
                {activeTab === 'video' && (
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                        {lesson.videoUrl ? <video src={lesson.videoUrl} controls onEnded={() => onLessonComplete(lesson._id)} className="w-full max-h-full"></video> : <div className="w-full h-full flex items-center justify-center"><p>No video available.</p></div>}
                    </div>
                )}
                {activeTab === 'resources' && (
                    <div className="space-y-2">
                        {lesson.resources && lesson.resources.map(resource => (
                            <a href={resource.url} key={resource._id} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-gray-800 p-3 rounded-md hover:bg-gray-700">
                                <span><FiFileText className="inline mr-2" />{resource.name}</span>
                                <FiDownload />
                            </a>
                        ))}
                    </div>
                )}
                {activeTab === 'quiz' && (
                    quizzes.length > 0 ? <QuizView quiz={quizzes[0]} isLessonCompleted={isLessonCompleted} /> : <p>No quiz for this lesson.</p>
                )}
            </div>
        </div>
    );
};

const QuizView = ({ quiz, isLessonCompleted }) => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);

    useEffect(() => {
        let timer;
        if (quizStarted && timeLeft > 0 && !result) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (quizStarted && timeLeft === 0 && !result) {
            handleNextQuestion();
        }
        return () => clearTimeout(timer);
    }, [quizStarted, timeLeft, result]);

    const handleAnswerChange = (questionId, option) => {
        setAnswers({
            ...answers,
            [questionId]: option
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(120);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        let score = 0;
        const formattedAnswers = quiz.questions.map(q => {
            if (answers[q._id] && answers[q._id].isCorrect) {
                score++;
            }
            return {
                questionId: q._id,
                selectedOptions: answers[q._id] ? [answers[q._id]._id] : []
            };
        });

        try {
            const response = await API.post(`/quiz/quizzes/${quiz._id}/submit`, { answers: formattedAnswers });
            setResult(response.data);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        }
        setQuizStarted(false);
    };

    const handleRetakeQuiz = () => {
        setResult(null);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setTimeLeft(120);
        setQuizStarted(true);
    };

    if (!isLessonCompleted) {
        return <p className="text-yellow-500">Please complete the lesson video before starting the quiz.</p>;
    }

    if (!quizStarted && !result) {
        return <button onClick={() => setQuizStarted(true)} className="bg-indigo-600 px-4 py-2 rounded-md">Start Quiz</button>;
    }

    if (result) {
        return (
            <div>
                <h3 className="text-xl font-bold">Quiz Result</h3>
                <p>You scored {result.score} out of {result.totalMarks}</p>
                <div className="mt-4">
                    <h4 className="font-bold">Detailed Analysis</h4>
                    {quiz.questions.map(q => (
                        <div key={q._id} className="mt-2">
                            <p>{q.questionText}</p>
                            {answers[q._id]?.isCorrect ? <span className="text-green-500 flex items-center"><FiCheckSquare className="mr-2" />Correct</span> : <span className="text-red-500 flex items-center"><FiXSquare className="mr-2" />Incorrect</span>}
                        </div>
                    ))}
                </div>
                <button onClick={handleRetakeQuiz} className="bg-indigo-600 px-4 py-2 rounded-md mt-4 flex items-center"><FiRefreshCw className="mr-2" /> Retake Quiz</button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isAttempted = answers.hasOwnProperty(currentQuestion._id);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <span className={`flex items-center ${isAttempted ? 'text-green-500' : 'text-gray-500'}`}>
                        {isAttempted ? <FiCheckSquare className="mr-2" /> : <FiXSquare className="mr-2" />}
                        {isAttempted ? 'Attempted' : 'Not Attempted'}
                    </span>
                    <span className="flex items-center"><FiClock className="mr-2" />{timeLeft}s</span>
                </div>
                <div key={currentQuestion._id} className="mb-4">
                    <p className="font-semibold">{currentQuestion.questionText}</p>
                    <div className="space-y-2 mt-2">
                        {currentQuestion.options.map(opt => (
                            <label key={opt._id} className="flex items-center">
                                <input type="radio" name={currentQuestion._id} onChange={() => handleAnswerChange(currentQuestion._id, opt)} className="mr-2" />
                                {opt.text}
                            </label>
                        ))}
                    </div>
                </div>
                <button onClick={handleNextQuestion} className="bg-indigo-600 px-4 py-2 rounded-md">
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default ContinueLearning;
