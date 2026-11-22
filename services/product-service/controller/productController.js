import uploadCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

export const addProduct = async (req, res) => {
    try {
        let { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        
        let image1 = req.files?.image1?.[0] ? await uploadCloudinary(req.files.image1[0].path) : "";
        let image2 = req.files?.image2?.[0] ? await uploadCloudinary(req.files.image2[0].path) : "";
        let image3 = req.files?.image3?.[0] ? await uploadCloudinary(req.files.image3[0].path) : "";
        let image4 = req.files?.image4?.[0] ? await uploadCloudinary(req.files.image4[0].path) : "";

        let ProductData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: typeof sizes === "string" ? JSON.parse(sizes) : sizes,
            bestseller: bestseller === "true" || bestseller === true,
            date: Date.now(),
            image1,
            image2,
            image3,
            image4
        };

        const product = await Product.create(ProductData);
        return res.status(201).json(product);
    } catch (error) {
        console.log("Add Product error", error);
        return res.status(500).json({ message: `Add product error: ${error.message}` });
    }
};

export const listProduct = async (req, res) => {
    try {
        const product = await Product.find({});
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: `List product error: ${error.message}` });
    }
};

export const removeProduct = async (req, res) => {
    try {
        let { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        return res.status(200).json(product);
    } catch (error) {
        console.log("Remove product error", error);
        return res.status(500).json({ message: `Remove product error: ${error.message}` });
    }
};

