import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  pictures:    [{ type: String }],
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
