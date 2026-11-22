import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const currency = 'inr';
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// For User - Cash On Delivery
export const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData: {} });

        return res.status(201).json({ message: 'Order Placed', orderId: newOrder._id });
    } catch (error) {
        console.log("placeOrder error", error);
        res.status(500).json({ message: 'Order Place error', error: error.message });
    }
};

// For User - Razorpay Gateway Order Creation
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.log("placeOrderRazorpay error", error);
        res.status(500).json({ message: error.message });
    }
};

// For User - Verify Razorpay Payment Signature/Status
export const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        
        if (orderInfo.status === 'paid') {
            await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await User.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ message: 'Payment Successful' });
        } else {
            res.status(400).json({ message: 'Payment Failed' });
        }
    } catch (error) {
        console.log("verifyRazorpay error", error);
        res.status(500).json({ message: error.message });
    }
};

// For User - Get All Orders
export const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId });
        return res.status(200).json(orders);
    } catch (error) {
        console.log("userOrders error", error);
        return res.status(500).json({ message: "userOrders error" });
    }
};

// For Admin - View All Orders
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        console.log("allOrders error", error);
        return res.status(500).json({ message: "adminAllOrders error" });
    }
};

// For Admin - Update Order Status
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        return res.status(200).json({ message: 'Status Updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

