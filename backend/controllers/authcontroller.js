import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import { sendEmail } from '../utils/emailService.js';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '7d'
    });
};

const home = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to VendorStreet API",
            version: "1.0.0",
            endpoints: {
                auth: "/api/auth",
                users: "/api/users",
                vendors: "/api/vendors",
                listings: "/api/listings",
                inquiries: "/api/inquiries"
            }
        });
    } catch (error) {
        console.error('Home route error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, role = 'buyer' } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create user
        const user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            role
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Send welcome email (optional)
        // await sendEmail(email, 'Welcome to VendorStreet', 'welcome', { firstName });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Get vendor profile if user is a vendor
        let vendorProfile = null;
        if (user.role === 'vendor') {
            vendorProfile = await VendorProfile.findOne({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    profileImage: user.profileImage,
                    emailVerified: user.emailVerified,
                    vendorProfile
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let vendorProfile = null;
        if (user.role === 'vendor') {
            vendorProfile = await VendorProfile.findOne({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            data: {
                user,
                vendorProfile
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { firstName, lastName, phone },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

export { home, register, login, getProfile, updateProfile };