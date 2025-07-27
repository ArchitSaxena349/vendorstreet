import { Router } from 'express';
import { 
    home, 
    register, 
    login, 
    getProfile, 
    updateProfile 
} from '../controllers/authcontroller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.route('/').get(home);
router.route('/register').post(register);
router.route('/login').post(login);

// Protected routes
router.route('/profile').get(authenticate, getProfile);
router.route('/profile').put(authenticate, updateProfile);

export default router;