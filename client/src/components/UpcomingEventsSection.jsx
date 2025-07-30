import { motion } from "framer-motion";

const events = [
  {
    title: "Live Webinar: Breaking Into Web Development",
    date: "July 28, 2025",
    time: "6:00 PM IST",
    speaker: "Ankit Sharma (Ex-FAANG)",
    description:
      "Learn how to kickstart your dev career, craft your portfolio, and land remote jobs.",
  },
  {
    title: "Panel Discussion: Future of EdTech in India",
    date: "August 4, 2025",
    time: "5:30 PM IST",
    speaker: "Panel of 5 Industry Experts",
    description:
      "Insights into the growing tech-education ecosystem & remote teaching opportunities.",
  },
  {
    title: "Hands-on Workshop: Full-Stack App in 2 Hours",
    date: "August 12, 2025",
    time: "7:00 PM IST",
    speaker: "Nisha Agarwal (MERN Mentor)",
    description:
      "Code a live project with step-by-step guidance using the MERN stack.",
  },
];

export default function UpcomingEventsSection() {
  return (
    <section className="bg-[#0d0d0d] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Upcoming Events & Webinars
          </h2>
          <p className="text-gray-400 text-lg">
            Don’t miss out on expert talks, live learning, and networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              className="bg-[#141414] border border-gray-700 rounded-2xl p-6 hover:shadow-indigo-500/20 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-indigo-400 mb-1">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                📅 {event.date} · 🕒 {event.time}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                🎙️ Speaker: <span className="text-white">{event.speaker}</span>
              </p>
              <p className="text-gray-400 text-sm mb-4">{event.description}</p>
              <a
                href="#"
                className="inline-block mt-2 px-4 py-2 border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg text-sm transition"
              >
                Register Now →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
