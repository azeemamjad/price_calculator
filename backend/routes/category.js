import express from 'express';
import Category from '../models/Category.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// ➕ Create category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    // Use user ID from authMiddleware
    const createdBy = req.user._id;

    const newCategory = new Category({ name, description, createdBy });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// 📥 Get all categories
router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔢 Count route (already exists)
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Category.countDocuments(); // or Product.countDocuments()
    res.json({ count });
  } catch (error) {
    console.error('Count route error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 📥 Get a single category by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✏️ Update a category
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Category not found' });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ❌ Delete a category
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
