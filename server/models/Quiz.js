// models/Quiz.js
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text:{type:String,required:true},
  isCorrect:{type:Boolean,required:true}
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema],
  type: {
    type: String,
    enum: ["mcq-single", "mcq-multiple"],
    default: "mcq-single"
  }
});

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  title: { type: String, required: true },
  questions: [questionSchema],
  totalMarks:{type:Number},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);



