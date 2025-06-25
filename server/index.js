import  express  from "express";
import dotenv from 'dotenv';

import connectDB from "./config/db.js";  
import cors from 'cors';  
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";


dotenv.config();
connectDB(); // Connect to MongoDB
const app=express();
(async () => {
  

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.send('API is working');
  });
  app.use("/api/auth",authRoutes);
  app.use("/api/course",courseRoutes);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

export default app;