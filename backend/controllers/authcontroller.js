import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Document from '../models/Document.js';
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

        // Prepare update data
        const updateData = { firstName, lastName, phone };

        // Handle profile image upload if present
        if (req.file) {
            // In a real application, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
            // For now, we'll store the file path
            updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get vendor profile if user is a vendor
        let vendorProfile = null;
        if (user.role === 'vendor') {
            vendorProfile = await VendorProfile.findOne({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user,
                vendorProfile
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);

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
            message: "Failed to update profile"
        });
    }
};

const updateVendorProfile = async (req, res) => {
    try {
        const {
            companyName,
            businessType,
            gstNumber,
            fssaiLicense,
            businessAddress
        } = req.body;

        // Validate required fields
        if (!companyName || !fssaiLicense || !businessAddress) {
            return res.status(400).json({
                success: false,
                message: "Company name, FSSAI license, and business address are required"
            });
        }

        // Validate FSSAI license format (14 digits)
        if (!/^[0-9]{14}$/.test(fssaiLicense)) {
            return res.status(400).json({
                success: false,
                message: "FSSAI license must be 14 digits"
            });
        }

        // Validate GST number format if provided
        if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
            return res.status(400).json({
                success: false,
                message: "Invalid GST number format"
            });
        }

        // Validate pincode
        if (businessAddress.pincode && !/^[0-9]{6}$/.test(businessAddress.pincode)) {
            return res.status(400).json({
                success: false,
                message: "Pincode must be 6 digits"
            });
        }

        const updateData = {
            companyName,
            businessType,
            gstNumber,
            fssaiLicense,
            businessAddress: {
                street: businessAddress.street,
                city: businessAddress.city,
                state: businessAddress.state,
                pincode: businessAddress.pincode,
                landmark: businessAddress.landmark || ''
            }
        };

        const vendorProfile = await VendorProfile.findOneAndUpdate(
            { userId: req.user.userId },
            updateData,
            { new: true, runValidators: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Vendor profile updated successfully",
            data: { vendorProfile }
        });

    } catch (error) {
        console.error('Update vendor profile error:', error);

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
            message: "Failed to update vendor profile"
        });
    }
};

const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        // In a real application, you would upload to cloud storage
        const profileImageUrl = `/uploads/profiles/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { profileImage: profileImageUrl },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            data: {
                user,
                profileImageUrl
            }
        });

    } catch (error) {
        console.error('Upload profile image error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to upload profile image"
        });
    }
};

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No document file provided"
            });
        }

        const { documentType, documentNumber, expiryDate } = req.body;

        if (!documentType) {
            return res.status(400).json({
                success: false,
                message: "Document type is required"
            });
        }

        // Check if document type already exists for this user
        const existingDocument = await Document.findOne({
            userId: req.user.userId,
            type: documentType
        });

        const documentUrl = `/uploads/documents/${req.file.filename}`;

        const documentData = {
            userId: req.user.userId,
            type: documentType,
            name: getDocumentName(documentType),
            documentNumber: documentNumber || '',
            filePath: documentUrl,
            originalName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            status: 'under_review',
            expiryDate: expiryDate ? new Date(expiryDate) : null
        };

        let document;
        if (existingDocument) {
            // Update existing document
            document = await Document.findByIdAndUpdate(
                existingDocument._id,
                documentData,
                { new: true }
            );
        } else {
            // Create new document
            document = new Document(documentData);
            await document.save();
        }

        res.status(200).json({
            success: true,
            message: "Document uploaded successfully",
            data: { document }
        });

    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to upload document"
        });
    }
};

const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        // Transform documents to match frontend format
        const transformedDocuments = documents.map(doc => ({
            id: doc._id,
            type: doc.type,
            name: doc.name,
            status: doc.status,
            uploadDate: doc.createdAt.toISOString().split('T')[0],
            expiryDate: doc.expiryDate ? doc.expiryDate.toISOString().split('T')[0] : null,
            scheduledDate: doc.scheduledDate ? doc.scheduledDate.toISOString().split('T')[0] : null,
            documentNumber: doc.documentNumber,
            filePath: doc.filePath,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType
        }));

        res.status(200).json({
            success: true,
            data: { documents: transformedDocuments }
        });

    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch documents"
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required"
            });
        }

        // Find and delete the document
        const document = await Document.findOneAndDelete({
            _id: documentId,
            userId: req.user.userId // Ensure user can only delete their own documents
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        // In a production environment, you would also delete the file from storage
        // fs.unlinkSync(path.join(__dirname, '..', document.filePath));

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete document"
        });
    }
};

const getDocumentName = (type) => {
    const documentNames = {
        'fssai': 'FSSAI License',
        'business': 'Business Registration',
        'gst': 'GST Certificate',
        'address': 'Address Proof',
        'identity': 'Identity Proof',
        'bank': 'Bank Statement'
    };
    return documentNames[type] || 'Document';
};

export { home, register, login, getProfile, updateProfile, updateVendorProfile, uploadProfileImage, uploadDocument, getDocuments, deleteDocument };