import { Router } from 'express';
import {
    applyForVendor,
    getVendorProfile,
    updateVendorProfile,
    getVendorDashboard
} from '../controllers/vendorController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All vendor routes require authentication
router.use(authenticate);

router.route('/apply').post(applyForVendor);
router.route('/profile').get(authorize('vendor', 'admin'), getVendorProfile);
router.route('/profile').put(authorize('vendor'), updateVendorProfile);
router.route('/dashboard').get(authorize('vendor'), getVendorDashboard);

export default router;