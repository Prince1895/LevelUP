import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { AuthContext } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiX, FiClock, FiBarChart2, FiStar, FiUsers, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Toaster Component for Notifications ---
const Toaster = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${bgColor} z-50`}>
            <FiAlertCircle />
            {message}
        </div>
    );
};

// --- Course Detail Modal ---
const CourseDetailModal = ({ course, onClose, onEnroll }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 text-white">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-2xl hover:text-red-500"><FiX /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img src={course.image || 'https://placehold.co/600x400/1a1a1a/FFF?text=Course'} alt={course.title} className="w-full h-auto object-cover rounded-lg mb-4"/>
                        <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                        <p className="text-gray-400 mb-4">Created by {course.instructor.name}</p>
                         <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                            <span className="capitalize flex items-center"><FiBarChart2 className="inline mr-1"/> {course.level}</span>
                            <span><FiClock className="inline mr-1"/> {course.duration}</span>
                            <span><FiUsers className="inline mr-1"/> 1,234 Students</span>
                            <span className="flex items-center"><FiStar className="inline mr-1 text-yellow-400"/> 4.5 (250 ratings)</span>
                        </div>
                        <p className="text-gray-300">{course.description}</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300">
                            <li>Master the fundamentals of {course.category}</li>
                            <li>Build real-world projects from scratch</li>
                            <li>Understand advanced concepts and best practices</li>
                            <li>Prepare for a career in the field</li>
                        </ul>
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-2">Price: &#x20B9;{course.price.toFixed(2)}</h3>
                            <button onClick={() => onEnroll(course)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition">
                                {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PublicCourses = () => {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [toaster, setToaster] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const loaderRef = useRef(null);

    const categories = ['All', 'Web Development', 'Data Science', 'UI/UX Design', 'Business', 'Marketing', 'Technical'];

    const fetchCourses = async (currentPage, category, search) => {
        if (currentPage === 1) setIsLoading(true);
        else setIsFetchingMore(true);

        try {
            const response = await API.get(`/course/all?page=${currentPage}&limit=6&category=${category === 'All' ? '' : category}&search=${search}`);
            const { courses: newCourses, totalPages } = response.data;

            setCourses(prev => currentPage === 1 ? newCourses : [...prev, ...newCourses]);
            setHasMore(currentPage < totalPages);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            if (currentPage === 1) setIsLoading(false);
            else setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        setCourses([]);
        setPage(1);
        setHasMore(true);
        fetchCourses(1, selectedCategory, searchTerm);
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !isFetchingMore && !isLoading) {
                setPage(prev => prev + 1);
            }
        }, { rootMargin: "200px" });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, isFetchingMore, isLoading]);

    useEffect(() => {
        if (page > 1) {
            fetchCourses(page, selectedCategory, searchTerm);
        }
    }, [page]);

    const handleEnroll = (course) => {
        if (!user) {
            setToaster({ message: 'Please log in to enroll.', type: 'error' });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            console.log(`User ${user.name} is enrolling in ${course.title}`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow bg-[#1a1a1a] text-white p-10">
                    <div className="flex justify-between items-center mb-8 pt-20">
                        <h1 className="text-3xl font-semibold">Browse All Courses</h1>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded-md pl-10 pr-4 py-2 text-sm w-64"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {isLoading ? <p className="text-center">Loading courses...</p> : (
                        <AnimatePresence>
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {courses.map((course, i) => (
                                    <motion.div
                                        key={course._id}
                                        onClick={() => setSelectedCourse(course)}
                                        className="cursor-pointer bg-[#111] border border-gray-800 rounded-lg shadow-lg hover:border-indigo-500 transition-all duration-300 flex flex-col"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <img src={course.image || 'https://placehold.co/600x400/1a1a1a/FFF?text=Course'} alt={course.title} className="w-full h-48 object-cover rounded-t-lg"/>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
                                            <p className="text-sm text-gray-400 mb-4">By {course.instructor.name}</p>
                                            <p className="text-sm text-gray-300 mb-4 flex-grow">{course.description.substring(0, 100)}...</p>
                                            <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                                                <span>{course.duration}</span>
                                                <span className="capitalize">{course.level}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-lg font-bold text-indigo-400">&#x20B9;{course.price.toFixed(2)}</p>
                                                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">{course.category}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    )}
                    <div ref={loaderRef} className="h-10 flex justify-center items-center">
                        {isFetchingMore && (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        )}
                        {!hasMore && courses.length > 0 && <p>You've reached the end!</p>}
                    </div>
                </main>
                <Footer />
                {selectedCourse && <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} onEnroll={handleEnroll} />}
                {toaster && <Toaster message={toaster.message} type={toaster.type} onDismiss={() => setToaster(null)} />}
            </div>
        </>
    );
};

export default PublicCourses;
