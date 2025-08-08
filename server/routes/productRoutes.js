import express from 'express';
import {  createProduct, updateProduct, deleteProduct, getMyProducts } from '../controllers/ProductController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', getMyProducts);
router.post('/', authMiddleware, requireRole('instructor', 'admin'), createProduct);
router.put('/:id', authMiddleware, requireRole('instructor', 'admin'), updateProduct);

router.delete('/:id', authMiddleware, requireRole('instructor', 'admin'), deleteProduct);

export default router;
