import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getPublicProducts,
    getAllProductsForAdmin,
    togglePublishStatus
 } from '../controllers/ProductController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', getPublicProducts); // Public route for all published products
router.get('/all', authMiddleware, requireRole('admin'), getAllProductsForAdmin); // Admin route to get all products
router.get('/my-products', authMiddleware, requireRole('instructor'), getMyProducts); // Instructor route for their products

router.post('/', authMiddleware, requireRole('instructor', 'admin'), createProduct);
router.put('/:id', authMiddleware, requireRole('instructor', 'admin'), updateProduct);
router.put('/:id/publish', authMiddleware, requireRole('instructor', 'admin'), togglePublishStatus);
router.delete('/:id', authMiddleware, requireRole('instructor', 'admin'), deleteProduct);

export default router;