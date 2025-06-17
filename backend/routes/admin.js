// routes/admin.js
import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js'; // JWT auth middleware

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.user; // user is already attached
    res.json({ user: { firstName, lastName, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
