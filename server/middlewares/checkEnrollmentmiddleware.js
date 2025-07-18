import Enrollment from "../models/Enrollment.js";

export const checkEnrollment = async (req, res, next) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Missing user info" });
    }

    const isEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!isEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course." });
    }

    next();
  } catch (error) {
    console.error("checkEnrollment middleware error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
