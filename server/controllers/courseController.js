import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";
import imagekit from '../config/imageKit.js';
import fs from 'fs';

// Get all courses with pagination, filtering by category or instructor
export const getAllCourses = async (req, res) => {
  try {
    const { category, instructor, page = 1, limit = 10 } = req.query;
    const filter = { published: true }; 
    if (category) filter.category = category;
    if (instructor) filter.instructor = instructor;

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("instructor", "name email");

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
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findOne({ _id: id, published: true }).populate(
      "instructor", "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found or not published" });
    }

    return res.status(200).json({
      message: "Get course by ID successfully",
      course,
    });
  } catch (error) {
    console.error("Get course by ID error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const imageFile = req.file;

    const { title, description, category, price, duration, published, level, tags } = req.body;

    if (!title || !description || !category || !price || !duration || !level || !imageFile) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/skillsphere_courses"
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    const image = optimizedImageUrl;

    const newCourse = new Course({
      title,
      description,
      category,
      price,
      duration,
      image,
      instructor: req.user._id,
      published,
      level,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
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

// Get courses for the logged-in instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.aggregate([
      { $match: { instructor: new mongoose.Types.ObjectId(instructorId) } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollmentData'
        }
      },
      {
        $addFields: {
          studentCount: { $size: '$enrollmentData' }
        }
      },
      {
        $project: {
          title: 1,
          category: 1,
          price: 1,
          published: 1,
          studentCount: 1,
          createdAt: 1,
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json({
      message: "Successfully fetched instructor courses",
      courses,
    });
  } catch (error) {
    console.error("Get Instructor Courses error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update the course (including the image)
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

    const userId = req.user._id.toString();
    const userRole = req.user.role;
    if (userRole !== "admin" && course.instructor.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this course" });
    }

    const { title, description, category, price, duration, published, level, tags } = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (price !== undefined) course.price = price;
    if (duration !== undefined) course.duration = duration;
    if (published !== undefined) course.published = published;
    if (level !== undefined) course.level = level;
    if (tags !== undefined) {
      course.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    }

    // Handle image upload via ImageKit.io
    if (req.file) {
      const imagePath = req.file.path;

      try {
        // Upload image to ImageKit
        const result = await imagekit.upload({
          file: imagePath, 
          fileName: req.file.originalname,
          folder: '/course-images',
          useUniqueFileName: true,
           
        });

        // After uploading, you will get a URL from ImageKit
        const imageUrl = result.url;

        // Update the course's image field with the new image URL
        course.image = imageUrl;

        // Optionally, delete the uploaded file from the server after it's uploaded to ImageKit
        fs.unlinkSync(imagePath);

      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }

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

// Delete a course
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

    const userId = req.user._id.toString();
    const userRole = req.user.role;
    if (userRole !== "admin" && course.instructor.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this course" });
    }

    await course.deleteOne();

    return res.status(200).json({
      message: "Course deleted successfully",
      course,
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).
    json({ message: "Server error", error: error.message });
  }
};