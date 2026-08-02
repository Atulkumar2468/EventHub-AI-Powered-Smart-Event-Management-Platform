const express = require('express');
const router = express.Router();
const { getDashboard, getPublicStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/stats', getPublicStats);
router.get('/me/dashboard', protect, getDashboard);

module.exports = router;
