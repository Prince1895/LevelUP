import Squares from '@/components/ui/squares'; // Ensure correct path
import { motion } from 'framer-motion';
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { WordRotate } from "@/components/magicui/word-rotate";

export default function HeroSection() {
  return (
    <div className="relative w-full h-[100vh] overflow-hidden ">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="right"
          speed={0.5}
          borderColor="#333"
          hoverFillColor="#444"
          squareSize={40}
        />
      </div>

      {/* Foreground Hero Content */}
      <section className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center mt-3  px-4">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        ><div className="p-[2px] rounded-md bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400 inline-block">
  <AnimatedGradientText className="text-xl font-semibold px-4 py-2 bg-black rounded-md">
    Learn. Build. Grow.
  </AnimatedGradientText>
</div>

</motion.p>
        <motion.h1
          className="text-3xl md:text-6xl font-extrabold leading-tight text-white mt-6 "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Empowering Students to <span className="text-indigo-400 "><WordRotate words={["Learn.","Build.","Grow."]} /></span>
          Enabling Instructors to <span className="text-indigo-400 "><WordRotate words={["Teach.","Inspire.","Transform."]} /></span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Join <span className="text-indigo-400 font-semibold">LevelUP</span> to master in-demand skills through hands-on learning or share your expertise and get rewarded as an instructor.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <a
            href="/courses"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition duration-300"
          >
            Browse Courses
          </a>
          <a
            href="/instructor-join"
            className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black rounded-lg font-medium transition duration-300"
          >
            Become an Instructor
          </a>
        </motion.div>
      </section>
    </div>
  );
}
