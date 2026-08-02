const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, deleteProduct } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
