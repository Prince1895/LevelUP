import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrder, confirmPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/confirm-payment", authMiddleware, confirmPayment); // <--- THIS

export default router;
