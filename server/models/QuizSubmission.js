// models/QuizSubmission.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  selectedOptions: [String], // option.text values
  isCorrect: Boolean
});

const submissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [answerSchema],
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("QuizSubmission", submissionSchema);
