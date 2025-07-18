import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  isPaid: {
  type: Boolean,
  default: false,
},
paymentInfo: {
  orderId: String,
  paymentId: String,
  status: String, // "success", "failed", etc.
  amount: Number, // in paise
},
status: {
  type: String,
  enum: ["enrolled", "cancelled"],
  default: "enrolled",
},
  completedLessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    }
  ],
  certificateIssued: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model("Enrollment", enrollmentSchema);
