import Razorpay from "razorpay";
import crypto from "crypto";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Enroll in Free Course
export const enrollFreeCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.price > 0) return res.status(400).json({ message: "This is a paid course" });

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({ user: userId, course: courseId });
    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.price === 0) return res.status(400).json({ message: "This is a free course" });

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const options = {
      amount: course.price * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_course_${courseId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// ✅ Verify Payment & Enroll
export const verifyPaymentAndEnroll = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
  const userId = req.user._id;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existing = await Enrollment.findOne({ user: userId, course: courseId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({ user: userId, course: courseId });
    res.status(201).json({ message: "Payment successful and enrolled", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};

// ✅ Get My Enrollments
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate("course", "title price image category")
      .sort({ createdAt: -1 });
    res.status(200).json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Admin: View All Enrollments
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json({ total: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
