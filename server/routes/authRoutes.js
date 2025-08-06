import express from 'express';
import { getMe, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
const authRoutes = express.Router();

authRoutes.post("/register",registerUser);
authRoutes.post("/login",loginUser);
authRoutes.get('/me', authMiddleware, getMe);
authRoutes.post("/logout", logoutUser); 

export default authRoutes;
