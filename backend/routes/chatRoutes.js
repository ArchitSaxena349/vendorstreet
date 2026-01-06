import express from 'express';
const router = express.Router();
import * as chatController from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

// Protect all routes
router.use(authenticate);

// Get conversations list
router.get('/conversations', chatController.getConversations);

// Get messages for a specific conversation
router.get('/:conversationId/messages', chatController.getMessages);

// Send a message
router.post('/send', chatController.sendMessage);

export default router;
