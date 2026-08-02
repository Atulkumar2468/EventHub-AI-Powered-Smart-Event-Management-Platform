const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  banner: { type: String, default: '' },
  logo: { type: String, default: '' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  memberCount: { type: Number, default: 0 },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  activityLevel: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  tags: [String],
  socialLinks: {
    instagram: String,
    discord: String,
    github: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
