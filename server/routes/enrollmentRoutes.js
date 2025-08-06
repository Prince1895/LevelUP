import express from "express";
import {
  enrollFreeCourse,
 
  verifyPaymentAndEnroll,
  getMyEnrollments,
  getAllEnrollments, // Admin only
  getEnrollmentsForCourse // New function
} from "../controllers/enrollmentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const enrollmentRoutes = express.Router();

// Student Routes
enrollmentRoutes.post("/free/:courseId", authMiddleware, enrollFreeCourse);

enrollmentRoutes.post("/paid/verify", authMiddleware, verifyPaymentAndEnroll);
enrollmentRoutes.get("/my", authMiddleware, getMyEnrollments);

// Admin & Instructor Route
enrollmentRoutes.get("/course/:courseId", authMiddleware, requireRole("admin", "instructor"), getEnrollmentsForCourse);

// Admin Route
enrollmentRoutes.get("/all", authMiddleware, requireRole("admin"), getAllEnrollments);

export default enrollmentRoutes;
