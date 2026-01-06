import express from 'express';
const router = express.Router();
import { createOrder, getMyOrders, getVendorOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/vendor-orders', authenticate, authorize('vendor'), getVendorOrders);
router.put('/:id/status', authenticate, authorize('vendor', 'admin'), updateOrderStatus);

export default router;
