import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'
import cartRoutes from './routes/CartRoutes.js'

dotenv.config();
let Port = process.env.PORT || 6000;
let app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
origin: ["http://localhost:5173","http://localhost:5174"],
credentials: true
}))
 
app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product",ProductRoutes)
app.use("/api/cart",cartRoutes)

app.listen(Port,()=>{console.log("server started at",Port)
 connectDb();
});