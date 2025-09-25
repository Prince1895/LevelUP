import dotenv from 'dotenv';
dotenv.config(); // Moved to the top

import express from "express";
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import connectDB from "./config/db.js";  
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import mongoose from 'mongoose';
import router from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js"; // Import product routes
import cartRoutes from "./routes/cartRoutes.js"; // Import cart routes
import orderRoutes from "./routes/orderRoutes.js"; // Import order routes

mongoose.set("debug", true);
connectDB(); 

const app = express();

(async () => {
  // 🛡️ Security Middleware
  app.use(helmet());

  app.use(hpp());

  // 📦 Body parser and cookies
  app.use(express.json());
  app.use(cookieParser());

  // 🚫 Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use(limiter);

const allowedOrigins = [
  'https://levelup01.vercel.app',
  'https://levelup-aysmncecw-prince-kumars-projects-db57e47d.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


  // 📡 Routes
  app.get('/', (_req, res) => res.send('API is working'));
  app.use("/api/auth", authRoutes);
  app.use("/api/course", courseRoutes);
  app.use("/api/lesson", lessonRoutes);
  app.use("/api/quiz", quizRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/enrollment", enrollmentRoutes);
  app.use("/api/enroll", router);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);

  // 🔥 Global error handler (fallback)
  app.use((err, req, res, next) => {
    console.error("Unexpected Error:", err.stack);
    res.status(500).json({ message: "Internal server error" });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();

export default app;
