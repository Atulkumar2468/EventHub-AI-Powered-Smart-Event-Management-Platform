const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, registerForEvent, cancelRegistration, getStats } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.get('/stats', getStats);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, createEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);

module.exports = router;
