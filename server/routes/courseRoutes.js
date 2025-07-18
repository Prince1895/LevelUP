import express from "express";
import { getAllCourses, getCourseById, createCourse, updateCourses, deleteCourse } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { checkEnrollment } from "../middlewares/checkEnrollmentmiddleware.js";
import { getLessonsForCourse, getQuizzesForCourse } from "../controllers/courseContentController.js";
const courseRoutes = express.Router();

courseRoutes.get("/all", getAllCourses);
courseRoutes.get("/by-id:id", getCourseById);
courseRoutes.post("/create", authMiddleware, requireRole("instructor"), createCourse);
courseRoutes.put("/update/:id", authMiddleware, requireRole("instructor","admin"), updateCourses);
courseRoutes.delete("/delete/:id", authMiddleware, requireRole("instructor","admin"), deleteCourse);
courseRoutes.get("/:courseId/lessons", authMiddleware, checkEnrollment, getLessonsForCourse);
courseRoutes.get("/:courseId/quiz", authMiddleware, checkEnrollment, getQuizzesForCourse);


export default courseRoutes;