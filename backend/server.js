import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import ConnectDB from './utils/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import listingRoutes from './routes/listingRoutes.js';

const app = express();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});

// Middleware
app.use(limiter);
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/listings', listingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

// 404 handler
app.use('/{*any}', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(` Server is running on port ${PORT}`);
        console.log(` Health check: http://localhost:${PORT}/health`);
        console.log(` API Base URL: http://localhost:${PORT}/api`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});



