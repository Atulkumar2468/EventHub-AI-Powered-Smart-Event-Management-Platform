require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Club = require('./models/Club');
const Product = require('./models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[SEED] Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  // Clear collections
  await Promise.all([User.deleteMany(), Event.deleteMany(), Club.deleteMany(), Product.deleteMany()]);
  console.log('[SEED] Collections cleared');

  // Create admin user
  const adminPass = await bcrypt.hash('password123', 10);
  const admin = await User.create({
    name: 'Aryan Sharma',
    email: 'aryan@mitwpu.edu.in',
    password: adminPass,
    branch: 'B.Tech CS',
    year: 3,
    xp: 12450,
    level: 24,
    participationScore: 84.2,
    leaderboardRank: 12,
    role: 'club_admin',
  });
  console.log('[SEED] Admin user: aryan@mitwpu.edu.in / password123');

  // Create clubs
  const clubs = await Club.insertMany([
    { name: 'Neural Network Club', category: 'AI / ML', description: 'Deep dive into LLMs and generative AI frameworks. MIT-WPU\'s AI powerhouse.', admin: admin._id, members: [admin._id], memberCount: 240, activityLevel: 'HIGH', tags: ['Machine Learning', 'Deep Learning', 'NLP', 'Vision', 'GenAI'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me', socialLinks: { instagram: '#', discord: '#', github: '#' } },
    { name: 'Formula Racing Team', category: 'Engineering', description: 'Building high-performance EV race cars for Formula Student competitions.', admin: admin._id, members: [admin._id], memberCount: 85, activityLevel: 'HIGH', tags: ['EV', 'Formula', 'Mechanical', 'Telemetry'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9V6NNoXOOBMl0gLlzu-rGQLJUHrY8YDk_FGXT8rhctZVH6Wwd6ecE5BNmv5Z_KkYF7LQH6wJb3QbPj1fK8oDWsJnIVkgtyPf2ki1QM5TBqmQwD1miDcqX4nQPSrrxs1VX7EbHjf0O-9K_3_mbK7mrN_6b0YsodrJ9DSHaWycZHApm_kUTdVE4Nfz5n-JZhNaxKx1TA6GhlwXfi0fU6F2tIprXEXditKJVCI1k-hD763q5abQoTJx9vp-ZesdkNeNV9McX-qtdwcp', socialLinks: { instagram: '#', discord: '#', github: '#' } },
    { name: 'Visual Storytellers', category: 'Arts / Media', description: 'Photography, filmmaking, and creative storytelling for the digital age.', admin: admin._id, members: [admin._id], memberCount: 110, activityLevel: 'MEDIUM', tags: ['Film', 'Photography', 'Design'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk', socialLinks: {} },
    { name: 'Robotics Brigade', category: 'Robotics', description: 'Building autonomous robots for national competitions and innovation challenges.', admin: admin._id, members: [admin._id], memberCount: 65, activityLevel: 'HIGH', tags: ['Robotics', 'IoT', 'Arduino', 'Autonomous'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E', socialLinks: {} },
  ]);
  console.log('[SEED] 4 clubs created');

  // Create events
  const events = await Event.insertMany([
    { title: 'CYBERPUNK 2025 SUMMIT', description: 'Annual flagship tech summit with AI demos, panel discussions, and a 6-hour hackathon. Theme: AI-Powered Futures.', category: 'Tech', date: new Date(Date.now()+7*86400000), time: '10:00 AM', venue: 'AUDITORIUM-A', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K', organizer: admin._id, club: clubs[0]._id, totalSeats: 200, registeredCount: 188, price: 0, status: 'upcoming', tags: ['AI', 'Hackathon', 'Summit'] },
    { title: 'BATTLE BOTS: ELITE', description: 'Autonomous robot combat competition. Teams of 4 compete in 3 rounds of mechanical combat.', category: 'Robotics', date: new Date(Date.now()+10*86400000), time: '2:00 PM', venue: 'ARENA 3', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E', organizer: admin._id, club: clubs[3]._id, totalSeats: 100, registeredCount: 100, price: 0, status: 'upcoming', tags: ['Robotics', 'Combat', 'Competition'] },
    { title: '24H HACKER SPRINT', description: 'A 24-hour coding marathon. Build any project, any stack, any idea. Prizes worth ₹1 Lakh+.', category: 'Coding', date: new Date(Date.now()+14*86400000), time: '9:00 AM', venue: 'C-LABS', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf0JTtXgxnMaH5ms_d3V59KDDAINM1SSL67AcQKcoyNrIkcNkMcjO5doSxMeJuLft_GwaCiujZn0Csv0S8GGZywBz_PLO5mkEJqCXR_ZiqvDnBoW8HeJHD7LfFOEIuhiHP949EeAEjdUC6fT7-vnSZnIPX4ayFOHmyjYTwtdAkKCK_MCW_BQTXRgkR4KwZaujfp7zhG1bXm_cK4vFU00JzxrhKu-L6TGAR4xsYD-yaQPcAjMZRQXump70aZBvaC2WR9wavFcK8WQzw', organizer: admin._id, club: clubs[0]._id, totalSeats: 150, registeredCount: 105, price: 0, status: 'upcoming', tags: ['Hackathon', 'Coding', 'Open'] },
    { title: 'LLM FINE-TUNING WORKSHOP', description: 'Hands-on workshop on fine-tuning large language models using PEFT and LoRA techniques.', category: 'Workshop', date: new Date(Date.now()+3*86400000), time: '11:00 AM', venue: 'ML LAB', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me', organizer: admin._id, club: clubs[0]._id, totalSeats: 40, registeredCount: 35, price: 100, status: 'live', tags: ['ML', 'LLM', 'Workshop'] },
    { title: 'FORMULA STUDENT EXPO', description: 'Showcasing the MIT-WPU Formula EV prototype with live telemetry data demonstrations.', category: 'Sports', date: new Date(Date.now()+20*86400000), time: '3:00 PM', venue: 'WPU ARENA', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9V6NNoXOOBMl0gLlzu-rGQLJUHrY8YDk_FGXT8rhctZVH6Wwd6ecE5BNmv5Z_KkYF7LQH6wJb3QbPj1fK8oDWsJnIVkgtyPf2ki1QM5TBqmQwD1miDcqX4nQPSrrxs1VX7EbHjf0O-9K_3_mbK7mrN_6b0YsodrJ9DSHaWycZHApm_kUTdVE4Nfz5n-JZhNaxKx1TA6GhlwXfi0fU6F2tIprXEXditKJVCI1k-hD763q5abQoTJx9vp-ZesdkNeNV9McX-qtdwcp', organizer: admin._id, club: clubs[1]._id, totalSeats: 500, registeredCount: 250, price: 0, status: 'upcoming', tags: ['EV', 'Expo', 'Free'] },
    { title: 'URBAN DESIGN SEMINAR', description: 'Distinguished speakers on the future of smart cities and sustainable urban planning.', category: 'Seminar', date: new Date(Date.now()+25*86400000), time: '10:30 AM', venue: 'MAIN AUDITORIUM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk', organizer: admin._id, totalSeats: 300, registeredCount: 120, price: 200, status: 'upcoming', tags: ['Urban', 'Design', 'Seminar'] },
  ]);
  console.log('[SEED] 6 events created');

  // Create products
  await Product.insertMany([
    { title: 'CUSTOM MECHANICAL KEYBOARD', description: 'Cherry MX Brown switches. Custom cyan keycaps. 6 months old, barely used. Comes with original box.', category: 'Hardware', price: 4500, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC-dGd_RnpZMtBBDDDy3j6Iu-GbEV8ds_ZXd6BTwUOLRz4eHoC0vj2YZuRz7PBTjgdr8-2MAs7tHcUDhuU8_6OClpAFhp2wc9ffrotjI5R_pb5XJ6kVM0BASw0mD34HPo2i0yva-J4jF4haO0QmYKkD2esGm0yQeGb1UZJ0_DuxmpXxjHsJTLDb8D7BAxRJ3ITo0FMqhE_uIYuoAvYm319X7_ZJLU-lPBcwNd2mZefz7B_KW1o4061p6XW3ScLNIf6_5XZ-JE1qmGQd'], seller: admin._id, condition: 'Like New', aiMatchScore: 98, tags: ['keyboard', 'hardware'] },
    { title: 'DSA ADVANCED MASTERBOOK', description: 'Comprehensive DSA textbook covering trees, graphs, DP, and competitive programming techniques.', category: 'Academic', price: 800, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCTskGljpZF-zPFtB0PQ8ZtG8TCCMTN-r03-lIyLNoBgWIjADU3YEo79WMcdUwT2DspV4D5waFGGOlWEB_-cx3QMu6x2UrHuHNiyZfxolgiV2zni8vneSoJcP0eh5z0krsODV7E5qkpIJ39tsN3Sllx3Gh1Tq8P9mcrMibk-xRKj09KbDoiAmUxd8rkT_nlj45YClhjarpku7VeKhJkrbzcflb1aZh3S6aHMIynKHHeVbMh-eDmWGlTKvkXK1zcFLb9ftSlKNNnbGjT'], seller: admin._id, condition: 'Good', aiMatchScore: 75, tags: ['books', 'algorithms'] },
    { title: 'NOISE CORE PRO HEADSET', description: 'Active noise cancellation. Carbon fiber finish. Cyan LED accents. Like new condition.', category: 'Electronics', price: 12000, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBZxmk9lqqfPvTvQ9iZqUNUu73MoPhw-1TXMNgWoHeMzW6_a7bBKOwTuDpEVrNTjVaYWp8Op4vETpVFi7ST-QDjiLvuiCrqxQJHwtJz1yPPhGNQc9GNqm8iXPmwETgbn1meZbB2SSvyi-MlFjVE03T2ZCm2I_TbcTvs27Ctc6EKuvK80f_QKAvGcels3EbNK8FqU1iHSvkmtMtQppLBLZ5Yc8tnNPTZxuCtBSxlpenyLUqV3r3s_7idQdm34NyiuLvMOIvd6nsw4yCv'], seller: admin._id, condition: 'Like New', aiMatchScore: 91, tags: ['audio', 'electronics'] },
    { title: 'RTX 3060 GRAPHICS CARD', description: 'NVIDIA RTX 3060 12GB VRAM. Slightly used for 6 months, never overclocked. Runs all games at 1440p.', category: 'Hardware', price: 22000, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me'], seller: admin._id, condition: 'Good', aiMatchScore: 88, tags: ['GPU', 'gaming', 'hardware'] },
  ]);
  console.log('[SEED] 4 products created');

  console.log('\n✅ SEED COMPLETE!');
  console.log('   Login: aryan@mitwpu.edu.in / password123');
  mongoose.connection.close();
};

seed().catch(err => { console.error(err); process.exit(1); });
