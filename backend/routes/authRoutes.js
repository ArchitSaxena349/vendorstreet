import { Router } from 'express';
import {
    home,
    register,
    login,
    getProfile,
    updateProfile,
    updateVendorProfile,
    uploadProfileImage,
    uploadDocument,
    getDocuments,
    deleteDocument
} from '../controllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadProfileImage as uploadMiddleware, uploadDocument as uploadDocMiddleware, handleUploadError } from '../middleware/upload.js';

const router = Router();

// Public routes
router.route('/').get(home);
router.route('/register').post(register);
router.route('/login').post(login);

// Protected routes
router.route('/profile').get(authenticate, getProfile);
router.route('/profile').put(authenticate, uploadMiddleware, handleUploadError, updateProfile);
router.route('/profile/vendor').put(authenticate, authorize('vendor', 'admin'), updateVendorProfile);
router.route('/profile/image').put(authenticate, uploadMiddleware, handleUploadError, uploadProfileImage);

// Document management routes
router.route('/documents').get(authenticate, getDocuments);
router.route('/documents').post(authenticate, uploadDocMiddleware, handleUploadError, uploadDocument);
router.route('/documents/:documentId').delete(authenticate, deleteDocument);

export default router;