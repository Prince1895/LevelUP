import Product from '../models/Product.js';
import mongoose from 'mongoose';
import imagekit from '../config/imagekit.js';
import fs from 'fs';

// @desc    Get all published products (for public marketplace view)
// @route   GET /api/products
// @access  Public
export const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({ published: true }).populate('createdBy', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all products for admin view
// @route   GET /api/products/all
// @access  Private/Admin
export const getAllProductsForAdmin = async (req, res) => {
    try {
        const products = await Product.find({}).populate('createdBy', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get products for the logged-in instructor
// @route   GET /api/products/my-products
// @access  Private/Instructor
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ createdBy: req.user._id }).populate('createdBy', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Instructor
export const createProduct = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Invalid request format. Could not parse form data." });
    }

    const { name, description, price, category } = req.body;
    const imageFile = req.file;

    if (!name || !description || price === undefined || !category || !imageFile) {
        return res.status(400).json({ message: "Please fill all required fields." });
    }

    try {
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/skillsphere_products"
        });
        fs.unlinkSync(imageFile.path);

        const product = new Product({
            name,
            description,
            price,
            category,
            image: response.url,
            createdBy: req.user._id
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Instructor
export const updateProduct = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Invalid request format. Could not parse form data." });
    }
    const { name, description, price, category } = req.body;
    const imageFile = req.file;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized' });
            }

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.category = category || product.category;

            if (imageFile) {
                const fileBuffer = fs.readFileSync(imageFile.path);
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: imageFile.originalname,
                    folder: "/skillsphere_products"
                });
                fs.unlinkSync(imageFile.path);
                product.image = response.url;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Instructor
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
             if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized' });
            }
            
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle publish status of a product
// @route   PUT /api/products/:id/publish
// @access  Private/Admin/Instructor
export const togglePublishStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized' });
            }

            product.published = req.body.published;
            await product.save();
            res.json({ message: 'Product status updated' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};