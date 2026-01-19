
import mongoose from 'mongoose';
import User from './src/models/user.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv'; // Load env vars if needed
dotenv.config();

const seedUser = async () => {
    try {
        await connectDB();

        const userExists = await User.findOne({ email: 'admin@cafecito.com' });

        if (userExists) {
            console.log('User already exists');
            process.exit(0);
        }

        const user = new User({
            name: 'Admin',
            email: 'admin@cafecito.com',
            password: '123'
        });

        await user.save();
        console.log('Admin user created');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

seedUser();
