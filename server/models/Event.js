const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Tech', 'Robotics', 'Coding', 'Cultural', 'Sports', 'Seminar', 'Workshop', 'Other'] },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String, default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K' },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalSeats: { type: Number, default: 100 },
  registeredCount: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  tags: [String],
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }],
  isAIFeatured: { type: Boolean, default: false },
  aiMatchScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
