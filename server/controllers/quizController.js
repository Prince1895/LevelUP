
import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import QuizSubmission from "../models/QuizSubmission.js";

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
import mongoose from 'mongoose'; // <-- Add this

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


//update quiz
export const updateQuiz = async (req, res) => {
  try {
    const { courseId, lessonId, quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Verify course & lesson ownership
    if (
      quiz.course.toString() !== courseId ||
      quiz.lesson.toString() !== lessonId
    ) {
      return res.status(400).json({ message: "Quiz does not match course or lesson" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Auth check: Only admin or course instructor can update
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to update this quiz" });
    }

    if (title !== undefined) quiz.title = title;
    if (questions !== undefined) {
      quiz.questions = questions;
      quiz.totalMarks = questions.length;
    }

    const updatedQuiz = await quiz.save();

    return res.status(200).json({
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Update quiz error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { courseId, lessonId, quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Ensure quiz belongs to the course and lesson
    if (
      quiz.course.toString() !== courseId ||
      quiz.lesson.toString() !== lessonId
    ) {
      return res.status(400).json({ message: "Quiz does not belong to this course/lesson" });
    }

    // Check permission: instructor or admin
    const course = await Course.findById(courseId);
    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await quiz.deleteOne();

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//submit quiz by  student
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers: submittedAnswers } = req.body || {};

    // Validate input
    if (!Array.isArray(submittedAnswers) || submittedAnswers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Prevent duplicate submissions
    const existing = await QuizSubmission.findOne({
      quiz: quizId,
      student: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    let score = 0;
    const detailedAnswers = [];

    for (const question of quiz.questions) {
      const userAnswer = submittedAnswers.find(
        (a) => a.questionId?.toString() === question._id.toString()
      );

      if (!userAnswer || !Array.isArray(userAnswer.selectedOptions)) continue;

      const correctOptionIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt._id.toString());

      const selectedOptionIds = userAnswer.selectedOptions.map((optId) => optId.toString());

      const isCorrect =
        question.type === "mcq-single"
          ? correctOptionIds.length === 1 &&
            selectedOptionIds.length === 1 &&
            correctOptionIds[0] === selectedOptionIds[0]
          : correctOptionIds.length === selectedOptionIds.length &&
            correctOptionIds.every((id) => selectedOptionIds.includes(id));

      if (isCorrect) score++;

      detailedAnswers.push({
        questionId: question._id,
        selectedOptions: selectedOptionIds,
        isCorrect,
      });

      // Debug logs
      console.log("Question ID:", question._id.toString());
      console.log("Correct Option IDs:", correctOptionIds);
      console.log("User Selected Option IDs:", selectedOptionIds);
      console.log("Is Correct:", isCorrect);
    }

    const submission = new QuizSubmission({
      quiz: quizId,
      student: req.user._id,
      answers: detailedAnswers,
      score,
    });

    await submission.save();

    return res.status(201).json({
      message: "Quiz submitted successfully",
      score,
      totalMarks: quiz.totalMarks,
      submission,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
//get my quiz result
export const getMyQuizResult = async (req, res) => {
  try {
    const { quizId } = req.params;

    const result = await QuizSubmission.findOne({
      quiz: quizId,
      student: req.user._id
    }).populate("quiz", "title totalMarks");

    if (!result) {
      return res.status(404).json({ message: "No result found" });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error("Get quiz result error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//getAllsubmissions
export const getAllSubmissions = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).populate("course");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const course = await Course.findById(quiz.course._id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role !== "admin" &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const submissions = await QuizSubmission.find({ quiz: quizId })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    res.status(200).json({ submissions });
  } catch (error) {
    console.error("Get all submissions error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};