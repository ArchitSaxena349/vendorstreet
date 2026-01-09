import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay with credentials
// These should be in .env, but using placeholders as requested if not present
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
})

// Create a new payment order
export const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt,
        }

        const order = await razorpay.orders.create(options)

        if (!order) {
            return res.status(500).json({ success: false, message: 'Some error occurred' })
        }

        res.json({
            success: true,
            data: order
        })
    } catch (error) {
        console.error('Error creating payment order:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Verify payment signature
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        const body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(body.toString())
            .digest('hex')

        const isAuthentic = expectedSignature === razorpay_signature

        if (isAuthentic) {
            res.json({
                success: true,
                message: 'Payment verification successful',
                paymentId: razorpay_payment_id
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            })
        }
    } catch (error) {
        console.error('Error verifying payment:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}


export const getRazorpayKey = async (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID' })
}
