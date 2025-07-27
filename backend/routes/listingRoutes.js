import { Router } from 'express';
import {
    createListing,
    getListings,
    getListingById,
    updateListing,
    deleteListing,
    getVendorListings
} from '../controllers/listingController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.route('/').get(optionalAuth, getListings);
router.route('/:id').get(optionalAuth, getListingById);

// Vendor routes
router.route('/').post(authenticate, authorize('vendor'), createListing);
router.route('/vendor/my-listings').get(authenticate, authorize('vendor'), getVendorListings);
router.route('/:id').put(authenticate, authorize('vendor'), updateListing);
router.route('/:id').delete(authenticate, authorize('vendor'), deleteListing);

export default router;