import { useState } from "react";

const instructors = [
  { name: "Dr. Michael Reynolds", title: "Data Science Expert" },
  { name: "Sarah Williams", title: "UX/UI Design Expert" },
  { name: "James Cooper", title: "Digital Marketing Expert" },
  { name: "Jennifer Lee", title: "Web Development Expert" },
];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

export default function BookSessionSection() {
  const [selectedInstructor, setSelectedInstructor] = useState(instructors[0]);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
  const [selectedDate, setSelectedDate] = useState("24 July 2025");
  const [type, setType] = useState("1:1 Session");

  return (
    <section className="bg-[#0d0d0d] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Instructors */}
        <div className="space-y-4">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Book <span className="text-indigo-400">1:1</span> & Group Sessions
            </h2>
            <p className="text-lg text-gray-400">
              Schedule personalized coaching with our top instructors
            </p>
          </div>

          <input
            type="text"
            placeholder="Search instructor..."
            className="w-full bg-[#0d0d0d] border border-gray-600 text-sm p-3 rounded-lg mb-4"
          />

          <div className="space-y-2">
            {instructors.map((ins, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedInstructor(ins)}
                className={`p-4 rounded-lg cursor-pointer bg-[#1b1b1b] border ${
                  selectedInstructor.name === ins.name ? "border-indigo-500" : "border-gray-700"
                } hover:border-indigo-400`}
              >
                <h4 className="font-medium">{ins.name}</h4>
                <p className="text-sm text-gray-400">{ins.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Panel */}
        <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2 bg-gray-800 rounded-md p-1 text-sm">
              <button
                className={`px-4 py-1 rounded ${
                  type === "1:1 Session" ? "bg-indigo-500 text-white" : "text-gray-300"
                }`}
                onClick={() => setType("1:1 Session")}
              >
                1:1 Session
              </button>
              <button
                className={`px-4 py-1 rounded ${
                  type === "Group Session" ? "bg-indigo-500 text-white" : "text-gray-300"
                }`}
                onClick={() => setType("Group Session")}
              >
                Group Session
              </button>
            </div>
            <p className="text-sm text-gray-400">{selectedDate}</p>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {timeSlots.map((time, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-lg text-sm border ${
                  selectedTime === time
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-gray-700 text-gray-300"
                } hover:border-indigo-400`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Discussion */}
          <textarea
            placeholder="What would you like to discuss?"
            rows="2"
            className="w-full bg-[#161616] border border-gray-700 p-3 text-sm text-white rounded-lg mb-3"
          />
          <textarea
            placeholder="Any specific questions or areas you'd like to focus on?"
            rows="2"
            className="w-full bg-[#161616] border border-gray-700 p-3 text-sm text-white rounded-lg mb-4"
          />

          <div className="text-sm text-gray-400 mb-3">
            {type} with <span className="text-white font-semibold">{selectedInstructor.name}</span> on{" "}
            <span className="text-white">{selectedDate}</span> at{" "}
            <span className="text-white">{selectedTime}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold">$75.00</p>
            <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white text-sm transition">
              Book a Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
