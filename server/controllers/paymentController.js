import razorpay from "../config/razorpay.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.price === 0) {
      return res.status(400).json({ message: "This course is free, no payment required" });
    }

    const options = {
      amount: course.price * 100, // ₹ to paise
      currency: "INR",
      receipt: `receipt_${courseId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
    } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courseId) {
      return res.status(400).json({ message: "Missing required payment fields" });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }

    // Enroll the user
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
    });

    return res.status(200).json({
      message: "Payment verified and enrollment successful",
      enrollment,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
