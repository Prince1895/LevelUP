
import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

//create a quizforlesson
export const createQuiz = async (req, res) => {
  try {
    const {courseId,lessonId} = req.params;
    const { title, questions } = req.body;

    const course=await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
  if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const quiz = new Quiz({
      title,
      course: courseId,
      lesson: lessonId,
      questions,
      totalMarks: questions.length,
      createdBy: req.user._id
    });
    const savedQuiz = await quiz.save();
    res.status(201).json({ message: "Quiz created", quiz: savedQuiz });
  } catch (error) {
    console.error("Create quiz error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get all quiz of a lesson
export const getAllQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    if (!lessonId) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID format" });
    }
    const quizzes = await Quiz.find({ lesson: lessonId }).sort({ createdAt: 1 });
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("get quiz by lessonId error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};