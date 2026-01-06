import { Router } from 'express';
import {
    applyForVendor,
    getVendorProfile,
    updateVendorProfile,
    getVendorDashboard,
    getPendingVendors,
    verifyVendor
} from '../controllers/vendorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

import upload from '../middleware/uploadMiddleware.js';

const router = Router();

// All vendor routes require authentication
router.use(authenticate);

router.route('/apply').post(
    upload.fields([
        { name: 'fssaiDocument', maxCount: 1 },
        { name: 'businessProof', maxCount: 1 }
    ]),
    applyForVendor
);
router.route('/profile').get(authorize('vendor', 'admin'), getVendorProfile);
router.route('/profile').put(authorize('vendor'), updateVendorProfile);
router.route('/dashboard').get(authorize('vendor'), getVendorDashboard);

// Admin Routes
router.route('/pending').get(authorize('admin'), getPendingVendors);
router.route('/:id/verify').put(authorize('admin'), verifyVendor);

export default router;