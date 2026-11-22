import express from 'express';
import { addToCart, getUserCart, UpdateCart } from '../controller/cartController.js';
import isAuth from '../middleware/isAuth.js';

const cartRoutes = express.Router();

cartRoutes.post("/add", isAuth, addToCart);
cartRoutes.post("/update", isAuth, UpdateCart);
cartRoutes.post("/get", isAuth, getUserCart);

export default cartRoutes;

