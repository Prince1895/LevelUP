import { SplineScene } from "@/components/ui/spline";
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios'; // Import your configured Axios instance

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // --- CHANGE THIS BACK TO USE THE API INSTANCE ---
      const response = await API.post('/auth/login', { email, password });
      const data = response.data; // Axios wraps the response in a `data` object

      // The rest of your logic remains the same
      toast.success("Login successful!");
      login(data.user, data.token);
      navigate('/dashboard');

    } catch (error) {
      console.error('Login failed:', error);
      // Axios errors have a `response` object
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0d0d0d] text-white">
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Welcome Back to LevelUP
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-neutral-300">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1 text-neutral-300">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-indigo-400 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 mt-2 rounded-md font-medium transition 
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-neutral-400 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-400 hover:underline">Sign up</a>
          </p>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default Loginpage;
