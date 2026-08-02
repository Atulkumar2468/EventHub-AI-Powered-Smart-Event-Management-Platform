const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String, required: true, unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Must be a valid email address']
  },
  password: { type: String, required: true, minlength: 6 },
  branch: { type: String, default: '' },
  year: { type: Number, default: 1 },
  avatar: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  participationScore: { type: Number, default: 0 },
  leaderboardRank: { type: Number, default: 999 },
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }],
  role: { type: String, enum: ['student', 'club_admin', 'admin'], default: 'student' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
