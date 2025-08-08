import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createOrder } from '../controllers/paymentController.js';
import { getMyOrders, verifyPayment } from '../controllers/Ordercontroller.js';

const router = express.Router();

// Create a new order (for both Razorpay and COD)
router.post('/create', authMiddleware, createOrder);

// Verify a Razorpay payment
router.post('/verify', authMiddleware, verifyPayment);

// Get the logged-in user's order history
router.get('/my-orders', authMiddleware, getMyOrders);

export default router;