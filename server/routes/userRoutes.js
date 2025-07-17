import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  deleteUser,
  approveInstructor,
  blockUser,
  unblockUser,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const userRoutes = express.Router();

// 👤 Authenticated User Routes
userRoutes.get("/profile", authMiddleware, getUserProfile);
userRoutes.put("/profile", authMiddleware, updateUserProfile);
userRoutes.put("/password", authMiddleware, changePassword);

// 🛡️ Admin-only Routes
userRoutes.get("/", authMiddleware, requireRole("admin"), getAllUsers);
userRoutes.delete("/:userId", authMiddleware, requireRole("admin"), deleteUser);
userRoutes.put("/:userId/approve", authMiddleware, requireRole("admin"), approveInstructor);
userRoutes.put("/:userId/block", authMiddleware, requireRole("admin"), blockUser);
userRoutes.put("/:userId/unblock", authMiddleware, requireRole("admin"), unblockUser);

export default userRoutes;
