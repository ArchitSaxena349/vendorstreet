

import { Router } from 'express';
const router = Router();
import { home, register } from '../controllers/authcontroller.js';

router.route('/').get(home);
router.route('/register').post(register);

export default router;