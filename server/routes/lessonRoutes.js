import express from "express";
import { getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson } from "../controllers/lessonController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import upload from '../middlewares/multer.js';
const lessonRoutes = express.Router();

lessonRoutes.get("/all/:courseId", getAllLessons);
lessonRoutes.get("/by-id/:lessonId", getLessonById);
lessonRoutes.post("/create/:courseId", authMiddleware, requireRole("instructor"), upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createLesson);
lessonRoutes.put("/update/:lessonId", authMiddleware, requireRole("instructor", "admin"), upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updateLesson);
lessonRoutes.delete("/delete/:lessonId", authMiddleware, requireRole("instructor", "admin"), deleteLesson);

export default lessonRoutes;