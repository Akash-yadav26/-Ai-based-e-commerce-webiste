import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5001"],
    credentials: true
}));

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("[Order-Service] MongoDB Connected successfully");
    } catch (err) {
        console.error("[Order-Service] MongoDB Connection Error:", err);
    }
};

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Order-Service' });
});

app.use('/api/order', orderRoutes);

app.listen(PORT, () => {
    console.log(`[Order-Service] Running on port ${PORT}`);
    connectDb();
});

