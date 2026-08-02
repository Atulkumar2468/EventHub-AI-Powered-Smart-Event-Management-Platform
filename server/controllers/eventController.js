const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @GET /api/events
const getEvents = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const events = await Event.find(filter).populate('club', 'name logo').populate('organizer', 'name').sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name logo description members')
      .populate('organizer', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/events
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @POST /api/events/:id/register
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const alreadyRegistered = await Registration.findOne({ user: req.user._id, event: event._id });
    if (alreadyRegistered) return res.status(400).json({ message: 'Already registered for this event' });
    const status = event.registeredCount < event.totalSeats ? 'confirmed' : 'waitlist';
    const registration = await Registration.create({ user: req.user._id, event: event._id, status });
    await Event.findByIdAndUpdate(event._id, { $inc: { registeredCount: 1 }, $push: { registrations: registration._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { registrations: registration._id }, $inc: { xp: 50, participationScore: 5 } });
    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/events/:id/register
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({ user: req.user._id, event: req.params.id });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    await Event.findByIdAndUpdate(req.params.id, { $inc: { registeredCount: -1 }, $pull: { registrations: registration._id } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { registrations: registration._id } });
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/events/stats
const getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const liveEvents = await Event.countDocuments({ status: 'live' });
    res.json({ totalEvents, liveEvents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, registerForEvent, cancelRegistration, getStats };
