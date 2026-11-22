import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5001"],
    credentials: true
}));

// MongoDB connection
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("[Auth-Service] MongoDB Connected successfully");
    } catch (err) {
        console.error("[Auth-Service] MongoDB Connection Error:", err);
    }
};

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Auth-Service' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`[Auth-Service] Running on port ${PORT}`);
    connectDb();
});

