import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ConnectDB from './utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import authRoutes from './routes/authRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const httpServer = createServer(app);

// Socket.io initialization
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [frontendUrl, frontendUrl.replace(/\/$/, "")];

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join user-specific room for private notifications
    socket.on('join_room', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

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
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images and documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API documentation endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'VendorStreet API v1.0.0',
        description: 'Food raw materials marketplace API with Real-Time features',
        status: 'operational',
        version: '1.0.0'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to VendorStreet API',
        version: '1.0.0'
    });
});

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
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

ConnectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(` Server is running on port ${PORT}`);
        console.log(` Socket.io initialized`);
        console.log(` Health check: http://localhost:${PORT}/health`);
        console.log(` API Base URL: http://localhost:${PORT}/api`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
