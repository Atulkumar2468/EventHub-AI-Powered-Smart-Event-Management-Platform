const Product = require('../models/Product');

// @GET /api/marketplace
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let filter = { status: 'available' };
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    const products = await Product.find(filter).populate('seller', 'name email branch year').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/marketplace/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email branch year');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.views += 1;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/marketplace
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @DELETE /api/marketplace/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct };
