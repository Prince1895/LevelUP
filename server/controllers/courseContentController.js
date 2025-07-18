import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";

// 🔹 Get lessons for a course (for enrolled users)
export const getLessonsForCourse = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID format" });
  }

  try {
    const course = await Course.findById(courseId).populate({
      path: "lessons",
      select: "title content videoUrl createdAt",
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Lessons fetched successfully",
      lessons: course.lessons,
    });
  } catch (error) {
    console.error("getLessonsForCourse error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Get quizzes for a course (for enrolled users)
export const getQuizzesForCourse = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID format" });
  }

  try {
    // Get all lessons in the course
    const course = await Course.findById(courseId).populate("lessons");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lessonIds = course.lessons.map(lesson => lesson._id);

    // Get quizzes for those lessons
    const quizzes = await Quiz.find({ lesson: { $in: lessonIds } }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Quizzes fetched successfully",
      quizzes,
    });
  } catch (error) {
    console.error("getQuizzesForCourse error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
