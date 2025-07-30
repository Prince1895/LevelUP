import { useState } from "react";

const courseTabs = [
  "All Courses",
  "Video Courses",
  "Live Classes",
  "Text Courses",
  "Free Courses",
  "Course Bundles",
];

const sampleCourses = [
  {
    title: "Understanding the Fundamentals of Data Science",
    instructor: "Dr. Michael Reynolds",
    hours: "50 hours",
    lessons: "130 lessons",
    price: "$89.99",
    oldPrice: "$99.99",
    rating: 4.5,
    badge: "Popular",
    image: "https://www.shutterstock.com/shutterstock/photos/1567366987/display_1500/stock-vector-data-science-banner-web-icon-for-computer-science-and-insight-ai-big-data-algorithm-analyze-1567366987.jpg",
  },
  {
    title: "UX/UI Design Masterclass",
    instructor: "Sarah Lee",
    hours: "80 hours",
    lessons: "180 lessons",
    price: "$65.99",
    rating: 4.6,
    badge: "Popular",
    image: "https://www.shutterstock.com/shutterstock/photos/1021116916/display_1500/stock-vector-conceptual-banner-booklet-brochure-user-experience-user-interface-d-phone-with-the-layout-of-1021116916.jpg",
  },
  {
    title: "Digital Marketing Bundle",
    instructor: "Jane Cooper",
    hours: "60 hours",
    lessons: "150 lessons",
    price: "$90.99",
    oldPrice: "$99.99",
    rating: 4.4,
    badge: "New",
    image: "https://www.shutterstock.com/shutterstock/photos/1735937897/display_1500/stock-vector-digital-marketing-landing-page-business-team-analyzes-mobile-traffic-advertising-and-sales-1735937897.jpg",
  },
];


export default function CourseSection() {
  const [activeTab, setActiveTab] = useState("All Courses");

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

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {courseTabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sampleCourses.map((course, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-lg transition hover:shadow-indigo-500/20"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 right-3 bg-indigo-600 text-xs text-white px-3 py-1 rounded-full">
                  {course.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex gap-4 text-sm text-gray-400 mb-2">
                  <span>📽️ {course.hours}</span>
                  <span>📚 {course.lessons}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2">{course.instructor}</p>

                <div className="flex items-center text-yellow-400 text-sm mb-2">
                  ⭐ {course.rating} / 5
                </div>

                <div className="flex gap-2 text-white font-bold">
                  <span>{course.price}</span>
                  {course.oldPrice && (
                    <span className="text-gray-400 line-through">
                      {course.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
