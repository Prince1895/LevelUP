export default function InstructorSection() {
  return (
    <section className="bg-[#0d0d0d] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Text + Icons */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Become An Instructor
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join our community of expert instructors and share your knowledge
            with millions of students worldwide. Create engaging courses.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: "💰",
                title: "Earn Revenue",
                desc: "Monetize your expertise with flexible teaching opportunities.",
              },
              {
                icon: "🌍",
                title: "Reach Students",
                desc: "Teach learners from around the world, at your own pace.",
              },
              {
                icon: "🧠",
                title: "Teach Your Way",
                desc: "Create courses on topics you know best, in the format you prefer.",
              },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl">{icon}</div>
                <div>
                  <h4 className="font-semibold text-white text-lg">{title}</h4>
                  <p className="text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="/instructor-join"
            className="mt-10 inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Start Teaching Today →
          </a>
        </div>

        {/* Right: Form */}
        <div className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl border border-gray-800">
          <h3 className="text-xl font-semibold mb-6">Submit Your Application</h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
              required
            />
            <select
              className="w-full px-4 py-3 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Select your expertise</option>
              <option>Web Development</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Data Science</option>
            </select>

            <div className="text-gray-400 text-sm">Experience Level:</div>
            <div className="flex gap-4 text-sm text-gray-300">
              <label><input type="radio" name="level" value="beginner" /> Beginner</label>
              <label><input type="radio" name="level" value="intermediate" /> Intermediate</label>
              <label><input type="radio" name="level" value="expert" /> Expert</label>
            </div>

            <textarea
              placeholder="Tell us about your course idea..."
              className="w-full px-4 py-3 rounded-md bg-[#111] border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
              rows="4"
            ></textarea>

            <div className="flex items-center gap-2">
              <input type="checkbox" required />
              <label className="text-gray-400 text-sm">
                I agree to the terms and conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
