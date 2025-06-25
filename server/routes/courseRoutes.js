import express from "express";
import { getAllCourses, getCourseById, createCourse, updateCourses, deleteCourse } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
const courseRoutes = express.Router();

courseRoutes.get("/all", getAllCourses);
courseRoutes.get("/by-id:id", getCourseById);
courseRoutes.post("/create", authMiddleware, requireRole("instructor"), createCourse);
courseRoutes.put("/update/:id", authMiddleware, requireRole("instructor"), updateCourses);
courseRoutes.delete("/delete/:id", authMiddleware, requireRole("instructor"), deleteCourse);

export default courseRoutes;