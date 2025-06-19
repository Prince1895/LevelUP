import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  },
  question: {
    type: String,
    required: true,
  },
  options: [String],
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
