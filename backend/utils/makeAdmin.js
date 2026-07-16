import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ConnectDB from './db.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const createOrPromoteAdmin = async () => {
    const adminEmail = 'admin@vendorstreet.com';
    const adminPassword = 'adminpassword123';
    
    try {
        await ConnectDB();
        
        // Find existing user
        let user = await User.findOne({ email: adminEmail });
        
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`Successfully promoted existing user ${adminEmail} to admin.`);
        } else {
            user = new User({
                email: adminEmail,
                password: adminPassword,
                firstName: 'System',
                lastName: 'Admin',
                phone: '9999999999',
                role: 'admin',
                emailVerified: true,
                phoneVerified: true
            });
            await user.save();
            console.log(`Successfully created new admin user:`);
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createOrPromoteAdmin();
