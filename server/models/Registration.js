const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketId: { type: String, unique: true },
  status: { type: String, enum: ['confirmed', 'waitlist', 'cancelled'], default: 'confirmed' },
  qrCode: { type: String, default: '' },
}, { timestamps: true });

registrationSchema.pre('save', function (next) {
  if (!this.ticketId) {
    this.ticketId = 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
