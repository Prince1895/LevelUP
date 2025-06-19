import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  title: {
    type: String,
    required: true,
  },
  videoUrl: String, // Cloudinary / S3 URL
  content: String, // markdown / text
  attachment: String, // PDF, ZIP etc.
  duration: Number, // in minutes
  order: Number, // lesson order in course
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);
