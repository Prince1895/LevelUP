import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true, // for faster category-based queries
    },
    duration: {
      type: String,
      default: "0 Hrs",
      required:true,
    },
    price: {
      type: Number,
      default: 0,
      required:true,
    },
    image: {
      type: String,
      required:true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      required:true,
    },
    tags: [String], // e.g. ["react", "nodejs", "mongo"]
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
