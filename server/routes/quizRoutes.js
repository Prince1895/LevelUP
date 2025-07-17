import express from "express";
import {
  createQuiz,
  getAllQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getMyQuizResult,
  getAllSubmissions,
} from "../controllers/quizController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const quizRoutes = express.Router();


quizRoutes.get(
  "/courses/:courseId/lessons/:lessonId/quizzes",getAllQuiz
);

quizRoutes.post(
  "/courses/:courseId/lessons/:lessonId/quizzes",
  authMiddleware,
  requireRole("admin", "instructor"),
  createQuiz
);

quizRoutes.put(
  "/courses/:courseId/lessons/:lessonId/quizzes/:quizId",
  authMiddleware,
  requireRole("admin", "instructor"),
  updateQuiz
);

quizRoutes.delete(
  "/courses/:courseId/lessons/:lessonId/quizzes/:quizId",
  authMiddleware,
  requireRole("admin", "instructor"),
  deleteQuiz
);

// Any authenticated user can submit or view their own result
quizRoutes.post("/quizzes/:quizId/submit", authMiddleware, requireRole("student"), submitQuiz);
quizRoutes.get("/quizzes/:quizId/my-result", authMiddleware, requireRole("student"), getMyQuizResult);

// Only instructor/admin can view all submissions
quizRoutes.get("/quizzes/:quizId/submissions", authMiddleware, requireRole("admin", "instructor"), getAllSubmissions);

export default quizRoutes;
