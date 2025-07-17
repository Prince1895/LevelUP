import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  isApproved: {
    type: Boolean,
    default: false, // Admin must approve instructors
  },
  isBlocked: {
    type: Boolean,
    default: false, // Admin can block users
  },
}, { timestamps: true });


 const User=mongoose.model("User", userSchema);
 export default User;