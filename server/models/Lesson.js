// models/Lesson.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
     thumbnail: { // Added this field
        type: String,
    },
    duration: {
      type: String, 
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
     resources: [
      {
        name: { type: String, required: true },      
        type: { type: String },                        
        url: { type: String, required: true },       
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
