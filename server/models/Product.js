const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Hardware', 'Academic', 'Lifestyle', 'Electronics', 'Books', 'Clothing', 'Other'] },
  price: { type: Number, required: true },
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'], default: 'Good' },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  aiMatchScore: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
