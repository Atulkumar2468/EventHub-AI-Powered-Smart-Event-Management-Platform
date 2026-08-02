// AI Recommendation Engine (Rule-based)
const Event = require('../models/Event');
const Club = require('../models/Club');
const Product = require('../models/Product');

const keywords = {
  tech: ['tech', 'coding', 'hackathon', 'web', 'ai', 'ml', 'data', 'software', 'developer'],
  robotics: ['robot', 'mechatronics', 'iot', 'hardware', 'circuit', 'arduino'],
  cultural: ['dance', 'music', 'art', 'film', 'cultural', 'theatre'],
  sports: ['sports', 'football', 'cricket', 'basketball', 'marathon', 'fitness'],
};

const getRecommendations = async (req, res) => {
  try {
    const { query } = req.body;
    const q = (query || '').toLowerCase();
    let category = null;
    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(w => q.includes(w))) { category = cat; break; }
    }
    let events = [], clubs = [], products = [];
    if (category === 'tech' || !category) {
      events = await Event.find({ category: { $in: ['Tech', 'Coding'] } }).limit(3).select('title category date venue');
    } else if (category === 'robotics') {
      events = await Event.find({ category: 'Robotics' }).limit(3).select('title category date venue');
    } else if (category === 'cultural') {
      events = await Event.find({ category: 'Cultural' }).limit(3).select('title category date venue');
    }
    clubs = await Club.find({}).limit(3).select('name category memberCount activityLevel');
    products = await Product.find({ status: 'available' }).limit(3).select('title category price');
    const messages = [
      { role: 'user', content: query },
      {
        role: 'assistant',
        content: `Scanning the EventHub neural network for "${query}"... Here's what I found for you, Commander!`,
        events, clubs, products,
        timestamp: new Date().toISOString(),
      }
    ];
    res.json({ messages, query });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRecommendations };
