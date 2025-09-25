import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
// Corrected: Import all necessary functions from the order controller
import { 
    createOrder, 
    getMyOrders, 
    verifyPayment, 
    cancelOrder,
    // Import the new function
} from '../controllers/orderController.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// --- User Routes ---

// Create a new marketplace order (for both Razorpay and COD)
router.post('/create', authMiddleware, createOrder);

// Verify a Razorpay payment for marketplace
router.post('/verify', authMiddleware, verifyPayment);

// Get the logged-in user's order history
router.get('/my-orders', authMiddleware, getMyOrders);

// Add the new route for cancelling an order
router.put('/:orderId/cancel', authMiddleware, cancelOrder);



export default router;
