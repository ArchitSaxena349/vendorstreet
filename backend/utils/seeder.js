import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ConnectDB from './db.js';
import Category from '../models/Category.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
    {
        name: 'Grains & Cereals',
        description: 'Rice, Wheat, Corn, Oats, etc.',
        icon: '🌾',
        sortOrder: 1
    },
    {
        name: 'Spices',
        description: 'Whole and powdered spices',
        icon: '🌶️',
        sortOrder: 2
    },
    {
        name: 'Dairy Products',
        description: 'Milk, Cheese, Butter, Ghee',
        icon: '🥛',
        sortOrder: 3
    },
    {
        name: 'Fruits & Vegetables',
        description: 'Fresh produce',
        icon: '🍎',
        sortOrder: 4
    },
    {
        name: 'Oils & Ghee',
        description: 'Cooking oils and fats',
        icon: '🛢️',
        sortOrder: 5
    }
];

const seedCategories = async () => {
    try {
        await ConnectDB();

        console.log('Upserting categories...');
        const operations = categories.map(cat => ({
            updateOne: {
                filter: { name: cat.name },
                update: {
                    $set: {
                        ...cat,
                        slug: cat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                    }
                },
                upsert: true
            }
        }));

        const result = await Category.bulkWrite(operations);
        console.log(`Categories seeded: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`);

        process.exit();
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
