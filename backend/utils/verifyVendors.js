import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ConnectDB from './db.js';
import VendorProfile from '../models/VendorProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyAllVendors = async () => {
    try {
        await ConnectDB();
        console.log('Connecting to database and verifying vendors...');
        
        const result = await VendorProfile.updateMany(
            { verificationStatus: { $ne: 'verified' } },
            { $set: { verificationStatus: 'verified', verifiedAt: new Date() } }
        );
        
        console.log(`Vendors verified successfully: updated ${result.modifiedCount} vendor profiles.`);
        process.exit(0);
    } catch (error) {
        console.error('Error verifying vendors:', error);
        process.exit(1);
    }
};

verifyAllVendors();
