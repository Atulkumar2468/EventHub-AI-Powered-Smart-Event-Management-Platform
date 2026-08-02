const User = require('../models/User');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Club = require('../models/Club');

// @GET /api/users/me/dashboard
const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const registrations = await Registration.find({ user: req.user._id, status: 'confirmed' })
      .populate({ path: 'event', select: 'title date venue category image status', match: { date: { $gte: new Date() } } })
      .sort({ createdAt: -1 }).limit(5);
    const upcomingTickets = registrations.filter(r => r.event);
    const allEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(6);
    const pulse = [
      { text: 'HackMIT registrations are now 90% full. Secure your spot!', time: '2 mins ago', color: 'primary' },
      { text: 'Robotics Lab updated their project showcase schedule.', time: '15 mins ago', color: 'secondary' },
      { text: 'New marketplace listing: "RTX 3060 - Slightly used". Check Market.', time: '1 hour ago', color: 'tertiary' },
    ];
    res.json({
      user: { ...user.toObject() },
      upcomingTickets,
      recommendations: allEvents,
      pulse,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/users/stats  (public stats for landing)
const getPublicStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalClubs = await Club.countDocuments();
    const totalProducts = await require('../models/Product').countDocuments({ status: 'available' });
    res.json({ totalEvents, totalClubs, totalProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard, getPublicStats };
