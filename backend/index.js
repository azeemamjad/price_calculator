import express from 'express';
import adminRoutes from './routes/admin.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import path from 'path';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit app if DB connection fails
  }
};

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Protect with auth middleware internally as shown in each router
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
