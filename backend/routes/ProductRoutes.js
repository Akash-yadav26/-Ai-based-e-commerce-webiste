import express from 'express'
import upload from '../middleware/multer.js'
import { addProduct, listProduct, removeProduct } from '../controller/productController.js'
import adminAuth from '../middleware/adminAuth.js'
let ProductRoutes = express.Router()

ProductRoutes.post("/addproduct",upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}
]),addProduct)

ProductRoutes.get("/list",listProduct)
ProductRoutes.post("/remove/:id",adminAuth,removeProduct)


export default ProductRoutes;