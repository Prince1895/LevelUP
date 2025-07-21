import { SplineScene } from "@/components/ui/splite";

function Loginpage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-neutral-900 text-white">
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Welcome Back to LevelUP
          </h1>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-neutral-300">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1 text-neutral-300">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <a href="#" className="text-indigo-400 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-neutral-400 mt-4 text-center">
            Don't have an account?{" "}
            <a href="#" className="text-indigo-400 hover:underline">Sign up</a>
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
