// db.js — Simple JSON file-based persistence layer
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// ── Default seed data ───────────────────────────────────────────────────────
function buildDefaults() {
  return {
    users: [
      {
        _id: 'u1',
        name: 'Aryan Sharma',
        email: 'aryan@example.com',
        password: bcrypt.hashSync('password123', 10),
        branch: 'B.Tech CS',
        year: 3,
        xp: 12450,
        level: 24,
        participationScore: 84.2,
        leaderboardRank: 12,
        role: 'club_admin',
        clubs: [],
        createdAt: new Date().toISOString(),
      },
    ],
    products: [
      { _id: 'p1', title: 'CUSTOM MECHANICAL KEYBOARD', description: 'Cherry MX Brown switches. Custom cyan keycaps. 6 months old, barely used.', category: 'Hardware', price: 4500, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC-dGd_RnpZMtBBDDDy3j6Iu-GbEV8ds_ZXd6BTwUOLRz4eHoC0vj2YZuRz7PBTjgdr8-2MAs7tHcUDhuU8_6OClpAFhp2wc9ffrotjI5R_pb5XJ6kVM0BASw0mD34HPo2i0yva-J4jF4haO0QmYKkD2esGm0yQeGb1UZJ0_DuxmpXxjHsJTLDb8D7BAxRJ3ITo0FMqhE_uIYuoAvYm319X7_ZJLU-lPBcwNd2mZefz7B_KW1o4061p6XW3ScLNIf6_5XZ-JE1qmGQd'], seller: { _id: 'u1', name: 'Aryan Sharma', branch: 'B.Tech CS', year: 3 }, condition: 'Like New', aiMatchScore: 98, status: 'available', views: 142, tags: ['keyboard'] },
      { _id: 'p2', title: 'DSA ADVANCED MASTERBOOK', description: 'Comprehensive DSA textbook. Covers trees, graphs, DP, and competitive programming.', category: 'Academic', price: 800, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCTskGljpZF-zPFtB0PQ8ZtG8TCCMTN-r03-lIyLNoBgWIjADU3YEo79WMcdUwT2DspV4D5waFGGOlWEB_-cx3QMu6x2UrHuHNiyZfxolgiV2zni8vneSoJcP0eh5z0krsODV7E5qkpIJ39tsN3Sllx3Gh1Tq8P9mcrMibk-xRKj09KbDoiAmUxd8rkT_nlj45YClhjarpku7VeKhJkrbzcflb1aZh3S6aHMIynKHHeVbMh-eDmWGlTKvkXK1zcFLb9ftSlKNNnbGjT'], seller: { _id: 'u1', name: 'Rohan Mehta', branch: 'B.Tech IT', year: 2 }, condition: 'Good', aiMatchScore: 75, status: 'available', views: 89, tags: ['books'] },
      { _id: 'p3', title: 'NOISE CORE PRO HEADSET', description: 'Active noise cancellation. Carbon fiber finish. Cyan LED accents.', category: 'Electronics', price: 12000, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBZxmk9lqqfPvTvQ9iZqUNUu73MoPhw-1TXMNgWoHeMzW6_a7bBKOwTuDpEVrNTjVaYWp8Op4vETpVFi7ST-QDjiLvuiCrqxQJHwtJz1yPPhGNQc9GNqm8iXPmwETgbn1meZbB2SSvyi-MlFjVE03T2ZCm2I_TbcTvs27Ctc6EKuvK80f_QKAvGcels3EbNK8FqU1iHSvkmtMtQppLBLZ5Yc8tnNPTZxuCtBSxlpenyLUqV3r3s_7idQdm34NyiuLvMOIvd6nsw4yCv'], seller: { _id: 'u1', name: 'Sneha Raut', branch: 'B.Tech ECE', year: 3 }, condition: 'Like New', aiMatchScore: 91, status: 'available', views: 204, tags: ['audio'] },
      { _id: 'p4', title: 'RTX 3060 GRAPHICS CARD', description: 'NVIDIA RTX 3060 12GB. Never overclocked. Runs all games at 1440p.', category: 'Hardware', price: 22000, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me'], seller: { _id: 'u1', name: 'Vikram Patil', branch: 'B.Tech CS', year: 4 }, condition: 'Good', aiMatchScore: 88, status: 'available', views: 321, tags: ['GPU'] },
      { _id: 'p5', title: 'LIMITED EDITION DROPS', category: 'Lifestyle', price: 2200, description: 'Exclusive streetwear drop with cyan branding. Size M.', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBVpRZG9tDJyBHKvlj68daLwV0_w-5GhuVmRBkrfgBoWSiaS8-sGyvl0rPyt8vh5XzM8EUzggs5k3nXZLNtDDegVoCWkO-XfJM7vDop4K6SUdyCos5w4GymA6EAYu_rGkZw9H1S1WZ3asUs-1cMrp48B0zI7RVIX2hBKe4XMsuod5vLbGyJNdO_UXfPHaKwBVWBVWgcVy-k34Qfy5GFdoq8J5TcM060L0GqFBZsqcfnhCm-tEbIqZPOIPRZM2SmiFjEY26YhZN1tFpn'], seller: { _id: 'u1', name: 'Priya Kulkarni', branch: 'BBA', year: 2 }, condition: 'New', aiMatchScore: 82, status: 'available', views: 157, tags: ['fashion'] },
    ],
    // registrations: { "userId_eventId": { ticketId, status, event, registeredAt } }
    registrations: {},
  };
}

// ── Load ────────────────────────────────────────────────────────────────────
function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      console.log('[DB] Loaded persisted data from db.json');
      console.log(`[DB] Users: ${data.users.length} | Products: ${data.products.length} | Registrations: ${Object.keys(data.registrations).length}`);
      return data;
    }
  } catch (e) {
    console.error('[DB] Failed to load db.json, using defaults:', e.message);
  }
  console.log('[DB] No db.json found, seeding with defaults');
  const defaults = buildDefaults();
  save(defaults);
  return defaults;
}

// ── Save ────────────────────────────────────────────────────────────────────
function save(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[DB] Failed to save db.json:', e.message);
  }
}

module.exports = { load, save };
