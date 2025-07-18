import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
await mongoose.connect(process.env.MONGODB_URI)
    console.log("database connected");
  } catch (error) {
    console.log(error.message);
  }
};

mongoose.connection.on('error', (err) => console.log("MongoDB connection error:", err));

export default connectDB;