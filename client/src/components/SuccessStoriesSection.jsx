import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Dummy student reviews
const reviews = [
  {
    name: "Aarav Mehta",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    feedback:
      "LevelUP transformed my career! The practical courses and mentorship were game-changing.",
  },
  {
    name: "Sanya Kapoor",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    feedback:
      "The hands-on approach to learning really helped me land my first internship as a frontend developer.",
  },
  {
    name: "Rahul Verma",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
    feedback:
      "Loved the instructor support and real-world projects. I cracked my dream job in 3 months!",
  },
];

export default function SuccessStoriesSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000); // 5 seconds auto-slide
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#0d0d0d] text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Student Success Stories</h2>
        <p className="text-gray-400 mb-10">
          Real feedback from learners who turned their goals into reality with LevelUP.
        </p>

        <div className="relative h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="bg-[#1a1a1a] px-8 py-6 rounded-2xl shadow-xl mx-auto max-w-xl"
            >
              <img
                src={reviews[current].image}
                alt={reviews[current].name}
                className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-indigo-500"
              />
              <p className="text-lg font-medium mb-2">{reviews[current].name}</p>

              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-yellow-400 text-xl ${
                      i < reviews[current].rating ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="text-gray-300 italic">“{reviews[current].feedback}”</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
