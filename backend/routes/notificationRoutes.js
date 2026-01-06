import express from 'express';
const router = express.Router();
import * as notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

// Protect all routes
router.use(authenticate);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Mark specific notification as read
router.put('/:id/read', notificationController.markRead);

// Mark ALL as read
router.put('/read-all', notificationController.markAllRead);

// Delete specific notification
router.delete('/:id', notificationController.deleteNotification);

// Clear ALL notifications
router.delete('/', notificationController.clearAll);

export default router;
