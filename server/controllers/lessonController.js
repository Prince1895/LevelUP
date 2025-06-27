import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";

//create  lessons for course
export const createLesson = async (req, res) => {
    try {
        const { title, content, videoUrl, duration,resources } = req.body;

        const { courseId } = req.params;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        if (!videoUrl) {
            return res.status(400).json({ message: "Video URL is required" });
        }
        if (!duration) {
            return res.status(400).json({ message: "Duration is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID format" });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const userId = req.user._id;
        if (req.user.role !== "admin" && course.instructor.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const newLesson = new Lesson({
            title,
            content,
            videoUrl,
            duration,
            course: courseId,
            resources
        });
        const savedLesson = await newLesson.save();
        course.lessons.push(newLesson._id);
        await course.save();

        res.status(201).json({ message: "Lesson created",  course,lesson: savedLesson });
    } catch (error) {
        console.error("Create lesson error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get all lessons of a course by course Id
export const getAllLessons = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID format" });
        }

        const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });
        res.status(200).json({ lessons });

    } catch (error) {
        console.error("get lesson by CourseId error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//get lesson by id
export const getLessonById = async (req, res) => {
    try {
        const { lessonId } = req.params;
        if (!lessonId) {
            return res.status(400).json({ message: "Lesson ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({ message: "Invalid lesson ID format" });
        }
        const lesson = await Lesson.findById(lessonId).populate("course","title");
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        res.status(200).json({
              message: "Lesson fetched successfully",
               lesson 
            });
    } catch (error) {
        console.error("get lesson by id error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//get the update lessons by id
export const updateLesson = async (req, res) => {
    try {
         const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
     if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, content, videoUrl, duration,resources } = req.body;

    if (title) lesson.title = title;
    if (content) lesson.content = content;
    if (videoUrl) lesson.videoUrl = videoUrl;
    if (duration) lesson.duration = duration;
    if (resources) lesson.resources = resources;
    const updated = await lesson.save();

    return res.status(200).json({ message: "Lesson updated successfully", lesson: updated });
  } catch (error) {
    console.error("Update lesson error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


//delete the lesson
export const deleteLesson = async (req, res) => {
  try { const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const course = await Course.findById(lesson.course);
     if (req.user.role !== "admin" && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await lesson.deleteOne();
    return res.status(200).json({ message: "Lesson deleted successfully", lesson });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
