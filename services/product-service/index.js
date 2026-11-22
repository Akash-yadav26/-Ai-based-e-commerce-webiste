import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5001"],
    credentials: true
}));

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("[Product-Service] MongoDB Connected successfully");
    } catch (err) {
        console.error("[Product-Service] MongoDB Connection Error:", err);
    }
};

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', service: 'Product-Service' });
});

app.use('/api/product', productRoutes);

app.listen(PORT, () => {
    console.log(`[Product-Service] Running on port ${PORT}`);
    connectDb();
});

