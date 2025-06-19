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
