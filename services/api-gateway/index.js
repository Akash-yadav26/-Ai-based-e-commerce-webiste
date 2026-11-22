import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup to allow frontend (5173) and admin (5174)
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(cookieParser());

// Microservices endpoints from env or defaults
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5003';
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:5004';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5005';

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'API-Gateway',
        timestamp: new Date().toISOString(),
        services: {
            authService: AUTH_SERVICE_URL,
            productService: PRODUCT_SERVICE_URL,
            cartService: CART_SERVICE_URL,
            orderService: ORDER_SERVICE_URL
        }
    });
});

// Proxy routes
// Note: For multipart/form-data (uploads in product service), http-proxy-middleware streams directly if body parser hasn't consumed it.
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true
}));

app.use('/api/user', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true
}));

app.use('/api/product', createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true
}));

app.use('/api/cart', createProxyMiddleware({
    target: CART_SERVICE_URL,
    changeOrigin: true
}));

app.use('/api/order', createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`[API-Gateway] Running on port ${PORT}`);
});

