import express from "express";
import {
  enrollFreeCourse,
  createRazorpayOrder,
  verifyPaymentAndEnroll,
  getMyEnrollments,
  getAllEnrollments // Admin only
} from "../controllers/enrollmentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const enrollmentRoutes = express.Router();

// Student Routes
enrollmentRoutes.post("/free/:courseId", authMiddleware, enrollFreeCourse);
enrollmentRoutes.post("/paid/:courseId/create-order", authMiddleware, createRazorpayOrder);
enrollmentRoutes.post("/paid/verify", authMiddleware, verifyPaymentAndEnroll);
enrollmentRoutes.get("/my", authMiddleware, getMyEnrollments);

// Admin Route
enrollmentRoutes.get("/all", authMiddleware, requireRole("admin"), getAllEnrollments);

export default enrollmentRoutes;
