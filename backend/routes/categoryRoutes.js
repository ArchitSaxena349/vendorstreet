import { Router } from 'express';
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getCategories);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('admin'), createCategory);
router.put('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

export default router;
