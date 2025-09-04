import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url= process.env.MONGODB_URL || 'mongodb://localhost:27017/mydatabase';

export default async function connectDB() {
    try {
        await mongoose.connect(url,{autoIndex:true});
        console.log('Connected to MongoDB');
        
        // Add connection error handler
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (err) {
        console.error("Error while connecting with Database:", err);
        process.exit(1); // Exit if unable to connect to database
    }
}