import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/auth.js';
import Category from './../models/Category.js'; // make sure it's imported

const router = express.Router();

import multer from 'multer';
const upload = multer({ dest: 'uploads/' }); // or configure as needed


// ➕ Create a new product
router.post('/', authMiddleware, upload.array('pictures'), async (req, res) => {
  try {
    const { title, description, price, discount, category } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, price, and category are required' });
    }

    // pictures uploaded
    const pictures = req.files.map(file => file.path); // or handle storing in cloud

    const newProduct = new Product({
      title,
      description,
      price: Number(price),
      discount: Number(discount),
      category,
      pictures,
      createdBy: req.user._id,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// 📥 Get all products with pagination and optional category filter
router.get('/', authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Product.countDocuments();

    // fetch products and convert to plain objects
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // plain JS objects

    // get category IDs
    const categoryIds = [...new Set(products.map(p => p.category.toString()))];
    
    // fetch all relevant categories in one query
    const categories = await Category.find({ _id: { $in: categoryIds } })
      .lean()
      .select('_id name');

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id] = cat.name;
    });

    // replace category IDs with names
    const updatedProducts = products.map(product => ({
      ...product,
      category: categoryMap[product.category] || product.category
    }));

    res.json({
      products: updatedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔢 Get total product count
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/search?q=keyword&page=1&limit=10
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const query = q ? {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ]
    } : {};

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalCount = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// 📥 Get product by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✏️ Update product
// Use multer middleware here as well
router.put('/:id', authMiddleware, upload.array('pictures'), async (req, res) => {
  try {
    const { title, description, price, discount, category } = req.body;

    let pictures = [];
    if (req.files && req.files.length > 0) {
      pictures = req.files.map(file => file.path);
    }

    // Fetch the existing product first
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // If no new pictures uploaded, keep existing pictures
    if (pictures.length === 0) {
      pictures = product.pictures;
    }

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    product.category = category || product.category;
    product.pictures = pictures;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ❌ Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
