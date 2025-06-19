import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  price: {
    type: Number,
    default: 0, 
  },
  image: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  published: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
