const express = require('express');
const router = express.Router();
const { getClubs, getClubById, joinClub, leaveClub, createClub } = require('../controllers/clubController');
const { protect } = require('../middleware/auth');

router.get('/', getClubs);
router.get('/:id', getClubById);
router.post('/', protect, createClub);
router.post('/:id/join', protect, joinClub);
router.delete('/:id/join', protect, leaveClub);

module.exports = router;
