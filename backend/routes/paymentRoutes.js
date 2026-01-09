import express from 'express'
import { createPaymentOrder, verifyPayment, getRazorpayKey } from '../controllers/paymentController.js'
import { authenticate as protect } from '../middleware/auth.js' // Assuming you have auth middleware

const router = express.Router()

router.post('/create-order', protect, createPaymentOrder)
router.post('/verify-payment', protect, verifyPayment)
router.get('/key', getRazorpayKey)

export default router
