const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, branch, year } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all required fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists with this email' });
    const user = await User.create({ name, email, password, branch, year });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      branch: user.branch, year: user.year, xp: user.xp,
      level: user.level, role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        branch: user.branch, year: user.year, xp: user.xp,
        level: user.level, participationScore: user.participationScore,
        leaderboardRank: user.leaderboardRank, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('clubs');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe };
