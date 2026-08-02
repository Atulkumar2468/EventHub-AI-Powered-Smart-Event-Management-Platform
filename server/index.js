require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { load, save } = require('./db');

const app = express();
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json({ limit: '10mb' })); // 10mb for base64 images
app.use(express.urlencoded({ extended: false }));

const JWT_SECRET = process.env.JWT_SECRET || 'eventhub_secret';

// ── Load persisted DB on startup ─────────────────────────────────────────────
const db = load();

// Events are fixed (not user-editable) — keep in memory only
const mockEvents = [
  { _id: 'ev1', title: 'CYBERPUNK 2025 SUMMIT', description: 'Annual flagship tech summit with AI demos, panel discussions, and a 6-hour hackathon.', category: 'Tech', date: new Date(Date.now()+7*86400000), time: '10:00 AM', venue: 'AUDITORIUM-A', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K', organizer: { _id: 'u1', name: 'Aryan Sharma' }, club: { _id: 'c1', name: 'Neural Network Club' }, totalSeats: 200, registeredCount: 188, price: 0, status: 'upcoming', tags: ['AI','Hackathon','Summit'] },
  { _id: 'ev2', title: 'BATTLE BOTS: ELITE', description: 'Autonomous robot combat competition. Teams of 4 compete in mechanical combat.', category: 'Robotics', date: new Date(Date.now()+10*86400000), time: '2:00 PM', venue: 'ARENA 3', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E', organizer: { _id: 'u1', name: 'Aryan Sharma' }, club: { _id: 'c4', name: 'Robotics Brigade' }, totalSeats: 100, registeredCount: 100, price: 0, status: 'upcoming', tags: ['Robotics','Combat'] },
  { _id: 'ev3', title: '24H HACKER SPRINT', description: 'A 24-hour coding marathon. Build any project. Prizes worth ₹1 Lakh+.', category: 'Coding', date: new Date(Date.now()+14*86400000), time: '9:00 AM', venue: 'C-LABS', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf0JTtXgxnMaH5ms_d3V59KDDAINM1SSL67AcQKcoyNrIkcNkMcjO5doSxMeJuLft_GwaCiujZn0Csv0S8GGZywBz_PLO5mkEJqCXR_ZiqvDnBoW8HeJHD7LfFOEIuhiHP949EeAEjdUC6fT7-vnSZnIPX4ayFOHmyjYTwtdAkKCK_MCW_BQTXRgkR4KwZaujfp7zhG1bXm_cK4vFU00JzxrhKu-L6TGAR4xsYD-yaQPcAjMZRQXump70aZBvaC2WR9wavFcK8WQzw', organizer: { _id: 'u1', name: 'Aryan Sharma' }, club: { _id: 'c1', name: 'Neural Network Club' }, totalSeats: 150, registeredCount: 105, price: 0, status: 'upcoming', tags: ['Hackathon','Coding'] },
  { _id: 'ev4', title: 'LLM FINE-TUNING WORKSHOP', description: 'Hands-on workshop on fine-tuning large language models using PEFT and LoRA.', category: 'Workshop', date: new Date(Date.now()+3*86400000), time: '11:00 AM', venue: 'ML LAB', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me', organizer: { _id: 'u1', name: 'Aryan Sharma' }, club: { _id: 'c1', name: 'Neural Network Club' }, totalSeats: 40, registeredCount: 35, price: 100, status: 'live', tags: ['ML','Workshop'] },
  { _id: 'ev5', title: 'FORMULA STUDENT EXPO', description: 'Showcasing a Formula EV prototype with live telemetry demos and pit-stop challenges.', category: 'Sports', date: new Date(Date.now()+20*86400000), time: '3:00 PM', venue: 'MAIN ARENA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9V6NNoXOOBMl0gLlzu-rGQLJUHrY8YDk_FGXT8rhctZVH6Wwd6ecE5BNmv5Z_KkYF7LQH6wJb3QbPj1fK8oDWsJnIVkgtyPf2ki1QM5TBqmQwD1miDcqX4nQPSrrxs1VX7EbHjf0O-9K_3_mbK7mrN_6b0YsodrJ9DSHaWycZHApm_kUTdVE4Nfz5n-JZhNaxKx1TA6GhlwXfi0fU6F2tIprXEXditKJVCI1k-hD763q5abQoTJx9vp-ZesdkNeNV9McX-qtdwcp', organizer: { _id: 'u1', name: 'Aryan Sharma' }, club: { _id: 'c2', name: 'Formula Racing Team' }, totalSeats: 500, registeredCount: 250, price: 0, status: 'upcoming', tags: ['EV','Expo'] },
  { _id: 'ev6', title: 'URBAN DESIGN SEMINAR', description: 'Distinguished speakers on smart cities and sustainable urban planning.', category: 'Seminar', date: new Date(Date.now()+25*86400000), time: '10:30 AM', venue: 'MAIN AUDITORIUM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk', organizer: { _id: 'u1', name: 'Aryan Sharma' }, totalSeats: 300, registeredCount: 120, price: 200, status: 'upcoming', tags: ['Urban','Design'] },
];

const mockClubs = [
  { _id: 'c1', name: 'Neural Network Club', category: 'AI / ML', description: 'Deep dive into LLMs and generative AI frameworks. The campus AI powerhouse.', memberCount: 240, activityLevel: 'HIGH', tags: ['Machine Learning','Deep Learning','NLP'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me', admin: { name: 'Prof. Mehta' }, members: [], events: [], socialLinks: { instagram: '#', discord: '#', github: '#' } },
  { _id: 'c2', name: 'Formula Racing Team', category: 'Engineering', description: 'Building high-performance EV race cars for Formula Student competitions.', memberCount: 85, activityLevel: 'HIGH', tags: ['EV','Formula','Mechanical'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9V6NNoXOOBMl0gLlzu-rGQLJUHrY8YDk_FGXT8rhctZVH6Wwd6ecE5BNmv5Z_KkYF7LQH6wJb3QbPj1fK8oDWsJnIVkgtyPf2ki1QM5TBqmQwD1miDcqX4nQPSrrxs1VX7EbHjf0O-9K_3_mbK7mrN_6b0YsodrJ9DSHaWycZHApm_kUTdVE4Nfz5n-JZhNaxKx1TA6GhlwXfi0fU6F2tIprXEXditKJVCI1k-hD763q5abQoTJx9vp-ZesdkNeNV9McX-qtdwcp', admin: { name: 'Aryan Sharma' }, members: [], events: [], socialLinks: { instagram: '#', discord: '#' } },
  { _id: 'c3', name: 'Visual Storytellers', category: 'Arts / Media', description: 'Photography, filmmaking, and creative storytelling for the digital age.', memberCount: 110, activityLevel: 'MEDIUM', tags: ['Film','Photography','Design'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk', admin: { name: 'Dr. Kadam' }, members: [], events: [], socialLinks: {} },
  { _id: 'c4', name: 'Robotics Brigade', category: 'Robotics', description: 'Building autonomous robots for national competitions and innovation challenges.', memberCount: 65, activityLevel: 'HIGH', tags: ['Robotics','IoT','Arduino'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E', admin: { name: 'Prof. Singh' }, members: [], events: [], socialLinks: {} },
];

// ── Auth middleware ───────────────────────────────────────────────────────────
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = db.users.find(u => u._id === decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch { return res.status(401).json({ message: 'Invalid token' }); }
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Auth
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, branch, year } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
  if (db.users.find(u => u.email === email)) return res.status(400).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { _id: 'u' + Date.now(), name, email, password: hashed, branch: branch || '', year: year || 1, xp: 0, level: 1, participationScore: 0, leaderboardRank: 999, role: 'student', clubs: [], createdAt: new Date().toISOString() };
  db.users.push(user);
  save(db);
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ ...user, password: undefined, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ ...user, password: undefined, token });
});

app.get('/api/auth/me', verifyToken, (req, res) => res.json({ ...req.user, password: undefined }));

// Events (static — no persistence needed)
app.get('/api/events/stats', (req, res) => res.json({ totalEvents: mockEvents.length, liveEvents: mockEvents.filter(e => e.status === 'live').length }));
app.get('/api/events', (req, res) => {
  let evs = [...mockEvents];
  if (req.query.category && req.query.category !== 'All') evs = evs.filter(e => e.category === req.query.category);
  if (req.query.search) evs = evs.filter(e => e.title.toLowerCase().includes(req.query.search.toLowerCase()));
  res.json(evs);
});
app.get('/api/events/:id', (req, res) => {
  const ev = mockEvents.find(e => e._id === req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
});

// Event Registration — persisted ✓
app.post('/api/events/:id/register', verifyToken, (req, res) => {
  const key = `${req.user._id}_${req.params.id}`;
  if (db.registrations[key]) return res.status(400).json({ message: 'Already registered' });
  const event = mockEvents.find(e => e._id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const ticket = {
    ticketId: 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    status: 'confirmed',
    registeredAt: new Date().toISOString(),
    event,
  };
  db.registrations[key] = ticket;
  save(db); // ← persist immediately
  res.status(201).json(ticket);
});

app.delete('/api/events/:id/register', verifyToken, (req, res) => {
  const key = `${req.user._id}_${req.params.id}`;
  delete db.registrations[key];
  save(db); // ← persist immediately
  res.json({ message: 'Cancelled' });
});

app.post('/api/events', verifyToken, (req, res) => {
  const ev = { _id: 'ev' + Date.now(), ...req.body, organizer: { _id: req.user._id, name: req.user.name } };
  mockEvents.push(ev);
  res.status(201).json(ev);
});

// Clubs
app.get('/api/clubs', (req, res) => {
  let clubs = [...mockClubs];
  if (req.query.search) clubs = clubs.filter(c => c.name.toLowerCase().includes(req.query.search.toLowerCase()));
  res.json(clubs);
});
app.get('/api/clubs/:id', (req, res) => {
  const club = mockClubs.find(c => c._id === req.params.id);
  if (!club) return res.status(404).json({ message: 'Club not found' });
  res.json({ ...club, events: mockEvents.filter(e => e.club?._id === club._id) });
});
app.post('/api/clubs/:id/join', verifyToken, (req, res) => res.json({ message: 'Joined!' }));
app.delete('/api/clubs/:id/join', verifyToken, (req, res) => res.json({ message: 'Left' }));

// Marketplace — persisted ✓
app.get('/api/marketplace', (req, res) => {
  let products = [...db.products];
  if (req.query.category && req.query.category !== 'All') products = products.filter(p => p.category === req.query.category);
  if (req.query.search) products = products.filter(p => p.title.toLowerCase().includes(req.query.search.toLowerCase()));
  res.json(products);
});
app.get('/api/marketplace/:id', (req, res) => {
  const p = db.products.find(p => p._id === req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
});
app.post('/api/marketplace', verifyToken, (req, res) => {
  const p = { _id: 'p' + Date.now(), ...req.body, seller: { _id: req.user._id, name: req.user.name, branch: req.user.branch, year: req.user.year }, status: 'available', views: 0, aiMatchScore: 0 };
  db.products.push(p);
  save(db); // ← persist immediately
  res.status(201).json(p);
});
app.delete('/api/marketplace/:id', verifyToken, (req, res) => {
  const idx = db.products.findIndex(p => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  db.products.splice(idx, 1);
  save(db); // ← persist immediately
  res.json({ message: 'Deleted' });
});

// Users / Dashboard
app.get('/api/users/stats', (req, res) => res.json({ totalEvents: mockEvents.length, totalClubs: mockClubs.length, totalProducts: db.products.length }));
app.get('/api/users/me/dashboard', verifyToken, (req, res) => {
  // Pull tickets for this user from persisted registrations
  const upcomingTickets = Object.entries(db.registrations)
    .filter(([key]) => key.startsWith(req.user._id + '_'))
    .map(([, reg]) => reg)
    .filter(reg => reg.event && new Date(reg.event.date) >= new Date())
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

  res.json({
    user: { ...req.user, password: undefined },
    upcomingTickets,
    recommendations: mockEvents.slice(0, 3),
    pulse: [
      { text: 'New hackathon registrations open. Secure your spot!', time: '2 mins ago', color: 'primary' },
      { text: 'Robotics Lab updated their project showcase schedule.', time: '15 mins ago', color: 'secondary' },
      { text: 'New marketplace listing: "RTX 3060 - Slightly used". Check Market.', time: '1 hour ago', color: 'tertiary' },
    ],
  });
});

// AI
app.post('/api/ai/recommend', verifyToken, (req, res) => {
  const q = (req.body.query || '').toLowerCase();
  let events = mockEvents.filter(e => q.includes(e.category.toLowerCase()) || q.includes('tech') || q.includes('event')).slice(0, 3);
  if (!events.length) events = mockEvents.slice(0, 2);
  const clubs = mockClubs.slice(0, 2);
  res.json({
    messages: [
      { role: 'user', content: req.body.query, timestamp: new Date().toISOString() },
      { role: 'assistant', content: `Neural scan complete for "${req.body.query}". Here's what the campus grid has for you, Commander!`, events, clubs, products: [], timestamp: new Date().toISOString() }
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'EventHub API Online', mode: 'File-persisted DB', timestamp: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] EventHub API running on port ${PORT} — http://localhost:${PORT}/api/health`));
