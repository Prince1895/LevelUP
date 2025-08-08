import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { FiClock, FiBookOpen } from 'react-icons/fi';

const CourseSection = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await API.get('/course/all?limit=3');
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Failed to fetch courses for section:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseClick = (courseId) => {
        navigate(`/courses?courseId=${courseId}`);
    };

    return (
        <section className="bg-[#0e0e0e] text-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                    Explore Our Courses
                </h2>
                <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
                    Discover thousands of courses across various categories to help you achieve
                    your personal and professional goals.
                </p>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <p className="text-center col-span-3">Loading courses...</p>
                    ) : (
                        courses.map((course) => (
                            <div
                                key={course._id}
                                onClick={() => handleCourseClick(course._id)}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-lg transition hover:shadow-indigo-500/20 cursor-pointer"
                            >
                                <div className="relative">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="flex gap-4 text-sm text-gray-400 mb-2">
                                        <span className="flex items-center gap-1"><FiClock /> {course.duration}</span>
                                        <span className="flex items-center gap-1"><FiBookOpen /> {course.lessons?.length || 0} lessons</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-2">{course.instructor.name}</p>
                                    <div className="flex items-center text-yellow-400 text-sm mb-2">
                                        ⭐ 4.5 / 5
                                    </div>
                                    <div className="flex gap-2 text-white font-bold">
                                        <span>&#x20B9;{course.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-center mt-12">
                    <a
                        href="/courses"
                        className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-lg text-sm"
                    >
                        View All courses →
                    </a>
                </div>
            </div>
        </section>
    );
}

export default CourseSection;
