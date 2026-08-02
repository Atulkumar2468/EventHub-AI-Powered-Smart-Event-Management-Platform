const Club = require('../models/Club');
const User = require('../models/User');

// @GET /api/clubs
const getClubs = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    const clubs = await Club.find(filter).populate('admin', 'name').sort({ memberCount: -1 });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/clubs/:id
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name')
      .populate({ path: 'events', options: { limit: 6 } });
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/clubs/:id/join
const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (club.members.includes(req.user._id)) return res.status(400).json({ message: 'Already a member' });
    club.members.push(req.user._id);
    club.memberCount += 1;
    await club.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { clubs: club._id }, $inc: { xp: 100 } });
    res.json({ message: 'Joined club successfully', memberCount: club.memberCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/clubs/:id/join
const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    club.members = club.members.filter(m => m.toString() !== req.user._id.toString());
    club.memberCount = Math.max(0, club.memberCount - 1);
    await club.save();
    await User.findByIdAndUpdate(req.user._id, { $pull: { clubs: club._id } });
    res.json({ message: 'Left club', memberCount: club.memberCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/clubs
const createClub = async (req, res) => {
  try {
    const club = await Club.create({ ...req.body, admin: req.user._id, members: [req.user._id], memberCount: 1 });
    await User.findByIdAndUpdate(req.user._id, { $push: { clubs: club._id } });
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getClubs, getClubById, joinClub, leaveClub, createClub };
