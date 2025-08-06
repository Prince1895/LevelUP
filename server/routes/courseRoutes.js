import express from "express";
import { 
    getAllCourses, 
    getCourseById, 
    createCourse, 
    updateCourses, 
    deleteCourse,
    getInstructorCourses
} from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";
import { checkEnrollment } from "../middlewares/checkEnrollmentmiddleware.js";
import { getLessonsForCourse, getQuizzesForCourse } from "../controllers/courseContentController.js";
import upload from "../config/multer.js"; // Import the multer config

const courseRoutes = express.Router();

// --- Public Routes ---
courseRoutes.get("/all", getAllCourses);
courseRoutes.get("/by-id/:id", getCourseById);

// --- Instructor/Admin Routes ---
// Use the upload middleware here to handle the image file
courseRoutes.post("/create", authMiddleware, requireRole("instructor"), upload.single('image'), createCourse);
courseRoutes.put("/update/:id", authMiddleware, requireRole("instructor", "admin"), upload.single('image'), updateCourses);
courseRoutes.delete("/delete/:id", authMiddleware, requireRole("instructor", "admin"), deleteCourse);

// NEW: Route for an instructor to get their own courses
courseRoutes.get("/instructor/my-courses", authMiddleware, requireRole("instructor"), getInstructorCourses);

// --- Enrolled Student Routes ---
courseRoutes.get("/:courseId/lessons", authMiddleware, checkEnrollment, getLessonsForCourse);
courseRoutes.get("/:courseId/quiz", authMiddleware, checkEnrollment, getQuizzesForCourse);

export default courseRoutes;
