import mongoose from "mongoose";
import Course from "../models/Course.js";
//get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { category, instructor, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (instructor) filter.instructor = instructor;

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    return res.status(200).json({
      message: "Get all courses successfully",
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    return res.status(500).json({ message: "Server error", 
      error: error.message 
    });
  }
};


//get the course by id
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: "Get course by ID successfully",
      course,
    });
  } catch (error) {
    console.error("Get course by ID error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, instructor, price, duration, image } = req.body;

  
    const newCourse = new Course({
      title,
      description,
      category,
      instructor,
      price,
      duration,
      image,
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

  

//update the course
export const updateCourses = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }


    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole !== "admin" && course.instructor.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this course" });
    }

    const { title, description, category, price, duration, image } = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (price !== undefined) course.price = price;
    if (duration !== undefined) course.duration = duration;
    if (image !== undefined) course.image = image;

    const updated = await course.save();

    return res.status(200).json({
      message: "Course updated successfully",
      course: updated,
    });

  } catch (error) {
    console.error("Update course error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete the course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
  
    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole !== "admin" && course.instructor.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this course" });
    }
    await course.deleteOne();

    return res.status(200).json({
      message: "Course deleted successfully",
      course,
    });
  }
    catch (error) {
      console.error("Delete course error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };