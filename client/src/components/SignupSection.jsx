import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Axios instance with baseURL
import toast from "react-hot-toast"; // ✅ Toast integration

function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Prevent multiple clicks
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setShowError(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setShowError(true);
      return;
    }

    setIsSubmitting(true); // ✅ Disable button

    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success(res.data.message || "Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false); // ✅ Re-enable button
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0d0d0d] pt-20 pb-20 text-white">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-[#0d0d0d] text-white p-10 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Welcome to <span className="text-indigo-500">LEVELUP</span> 🚀
        </h2>
        <p className="text-lg text-gray-300 max-w-md mb-6 leading-relaxed">
          Join a thriving community where{" "}
          <span className="text-indigo-400 font-semibold">students</span> grow
          their skills, and{" "}
          <span className="text-indigo-400 font-semibold">instructors</span>{" "}
          share knowledge and earn with purpose.
        </p>
        <p className="text-sm text-gray-500 italic">
          Together, we Learn. Build. Grow. And Teach with Impact.
        </p>
      </div>

      {/* Right - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Create Your LEVELUP Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm mb-1 text-neutral-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-neutral-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm mb-1 text-neutral-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1 text-neutral-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-1 text-neutral-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-md bg-neutral-800 text-white border ${
                  showError ? "border-red-500" : "border-neutral-700"
                } focus:outline-none focus:ring-2 ${
                  showError ? "focus:ring-red-500" : "focus:ring-indigo-500"
                }`}
                placeholder="••••••••"
              />
              {showError && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-center text-sm">
              <input type="checkbox" required className="mr-2" />
              <label>
                I agree to the{" "}
                <a href="#" className="text-indigo-400 underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 mt-2 rounded-md font-medium transition ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <p className="text-sm text-neutral-400 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
