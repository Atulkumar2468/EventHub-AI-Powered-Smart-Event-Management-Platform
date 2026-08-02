import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, eventsAPI } from '../services/api';

const EVENTS_DATA = [
  { title: 'CYBERPUNK 2025 SUMMIT', category: 'TECH FEST', date: 'OCT 12, 2025', venue: 'AUDITORIUM-A', seats: 12, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K', soldOut: false },
  { title: 'BATTLE BOTS: ELITE', category: 'ROBOTICS', date: 'OCT 15, 2025', venue: 'ARENA 3', seats: 0, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E', soldOut: true },
  { title: '24H HACKER SPRINT', category: 'CODING', date: 'OCT 20, 2025', venue: 'C-LABS', seats: 45, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf0JTtXgxnMaH5ms_d3V59KDDAINM1SSL67AcQKcoyNrIkcNkMcjO5doSxMeJuLft_GwaCiujZn0Csv0S8GGZywBz_PLO5mkEJqCXR_ZiqvDnBoW8HeJHD7LfFOEIuhiHP949EeAEjdUC6fT7-vnSZnIPX4ayFOHmyjYTwtdAkKCK_MCW_BQTXRgkR4KwZaujfp7zhG1bXm_cK4vFU00JzxrhKu-L6TGAR4xsYD-yaQPcAjMZRQXump70aZBvaC2WR9wavFcK8WQzw', soldOut: false },
];

const PRODUCTS_DATA = [
  { title: 'CUSTOM MECHANICAL KB', cat: 'HARDWARE / PERIPHERALS', price: '₹4,500', ai: 98, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-dGd_RnpZMtBBDDDy3j6Iu-GbEV8ds_ZXd6BTwUOLRz4eHoC0vj2YZuRz7PBTjgdr8-2MAs7tHcUDhuU8_6OClpAFhp2wc9ffrotjI5R_pb5XJ6kVM0BASw0mD34HPo2i0yva-J4jF4haO0QmYKkD2esGm0yQeGb1UZJ0_DuxmpXxjHsJTLDb8D7BAxRJ3ITo0FMqhE_uIYuoAvYm319X7_ZJLU-lPBcwNd2mZefz7B_KW1o4061p6XW3ScLNIf6_5XZ-JE1qmGQd' },
  { title: 'LIMITED EDITION DROPS', cat: 'LIFESTYLE / GEAR', price: '₹2,200', ai: 82, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVpRZG9tDJyBHKvlj68daLwV0_w-5GhuVmRBkrfgBoWSiaS8-sGyvl0rPyt8vh5XzM8EUzggs5k3nXZLNtDDegVoCWkO-XfJM7vDop4K6SUdyCos5w4GymA6EAYu_rGkZw9H1S1WZ3asUs-1cMrp48B0zI7RVIX2hBKe4XMsuod5vLbGyJNdO_UXfPHaKwBVWBVWgcVy-k34Qfy5GFdoq8J5TcM060L0GqFBZsqcfnhCm-tEbIqZPOIPRZM2SmiFjEY26YhZN1tFpn' },
  { title: 'DSA ADVANCED MASTERBOOK', cat: 'ACADEMIC / BOOKS', price: '₹800', ai: 75, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTskGljpZF-zPFtB0PQ8ZtG8TCCMTN-r03-lIyLNoBgWIjADU3YEo79WMcdUwT2DspV4D5waFGGOlWEB_-cx3QMu6x2UrHuHNiyZfxolgiV2zni8vneSoJcP0eh5z0krsODV7E5qkpIJ39tsN3Sllx3Gh1Tq8P9mcrMibk-xRKj09KbDoiAmUxd8rkT_nlj45YClhjarpku7VeKhJkrbzcflb1aZh3S6aHMIynKHHeVbMh-eDmWGlTKvkXK1zcFLb9ftSlKNNnbGjT' },
  { title: 'NOISE CORE HEADSET', cat: 'HARDWARE / AUDIO', price: '₹12,000', ai: 91, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZxmk9lqqfPvTvQ9iZqUNUu73MoPhw-1TXMNgWoHeMzW6_a7bBKOwTuDpEVrNTjVaYWp8Op4vETpVFi7ST-QDjiLvuiCrqxQJHwtJz1yPPhGNQc9GNqm8iXPmwETgbn1meZbB2SSvyi-MlFjVE03T2ZCm2I_TbcTvs27Ctc6EKuvK80f_QKAvGcels3EbNK8FqU1iHSvkmtMtQppLBLZ5Yc8tnNPTZxuCtBSxlpenyLUqV3r3s_7idQdm34NyiuLvMOIvd6nsw4yCv' },
];

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

export default function Landing() {
  const [stats, setStats] = useState({ totalEvents: 154, totalClubs: 42, totalProducts: 892 });
  const eventsCount = useCountUp(stats.totalEvents);
  const clubsCount = useCountUp(stats.totalClubs);
  const marketCount = useCountUp(stats.totalProducts);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    usersAPI.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const faqs = [
    { q: 'How do I verify my student status?', a: 'Simply register with any valid email address. Upon registration, your account is instantly activated to access all campus modules.' },
    { q: 'Is the marketplace peer-to-peer?', a: 'Yes. EventHub acts as the secure bridge. We use a campus escrow system to ensure safety for both buyers and sellers within the campus ecosystem.' },
    { q: 'How do AI Matches work?', a: 'Our neural engine analyzes your participation history, club affiliations, and search patterns to predict events and products that align with your technical trajectory.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-on-surface overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-header z-50 bg-surface border-b-2 border-outline-variant flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <span className="font-space text-2xl font-bold text-primary-container tracking-tighter">EVENTHUB</span>
          <div className="hidden md:flex gap-6">
            <a href="#events" className="font-mono text-nav-mono text-primary uppercase hover:text-primary-container transition-colors">DISCOVER</a>
            <a href="#marketplace" className="font-mono text-nav-mono text-on-surface-variant hover:text-primary-container transition-colors uppercase">MARKETPLACE</a>
            <a href="#faq" className="font-mono text-nav-mono text-on-surface-variant hover:text-primary-container transition-colors uppercase">FAQ</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="font-mono text-nav-mono text-on-surface-variant hover:text-primary uppercase px-4 py-2 border border-transparent hover:border-outline-variant transition-all">LOGIN</Link>
          <Link to="/register" className="btn-primary py-2 text-[11px]">JOIN THE HUB</Link>
        </div>
      </nav>

      <main className="mt-header">
        {/* Hero */}
        <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-6 py-24 overflow-hidden">
          <div className="scanner-line"></div>
          <div className="absolute inset-0 grid-bg opacity-30"></div>
          <div className="relative z-10 text-center max-w-4xl">
            <p className="font-mono text-label-mono text-primary-container mb-6 tracking-[0.3em] uppercase">COMMAND CENTER ALPHA-01 // CAMPUS HUB</p>
            <h1 className="font-space text-[60px] md:text-[80px] font-bold leading-none mb-8 uppercase tracking-tighter">
              CAMPUS LIFE,<br />
              <span className="text-primary-container">AMPLIFIED.</span>
            </h1>
            <p className="font-body text-body-md text-on-surface-variant mb-12 max-w-2xl mx-auto">
              The digital pulse of your campus. Connect with clubs, trade in the marketplace, and dominate the event circuit through our integrated digital command center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-primary flex items-center gap-2 justify-center">
                EXPLORE EVENTS <span className="material-symbols-outlined">trending_flat</span>
              </Link>
              <Link to="/register" className="btn-outline flex items-center gap-2 justify-center">JOIN THE HUB</Link>
            </div>
          </div>
          {/* Stats Bar */}
          <div className="absolute bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant py-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
            {[{ val: eventsCount, label: 'Total Events' }, { val: clubsCount, label: 'Active Clubs' }, { val: marketCount, label: 'Market Items' }].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center justify-center p-4">
                <span className="font-space text-headline-xl text-primary-container font-bold">{val.toLocaleString()}</span>
                <span className="font-mono text-label-mono text-on-surface-variant uppercase tracking-widest mt-2">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Events */}
        <section id="events" className="px-6 py-24 bg-[#0a0a0a]">
          <div className="flex items-end justify-between mb-12 max-w-7xl mx-auto">
            <div>
              <h2 className="font-space text-headline-lg font-bold uppercase mb-2">Trending Now</h2>
              <div className="w-24 h-0.5 bg-primary-container"></div>
            </div>
            <Link to="/events" className="font-mono text-label-mono text-primary-container flex items-center gap-2 uppercase hover:gap-3 transition-all">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {EVENTS_DATA.map((ev) => (
              <div key={ev.title} className="mechanical-border bg-surface-container group neon-hover cursor-pointer" onClick={() => {}}>
                <div className="aspect-video relative overflow-hidden">
                  <img src={ev.img} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="tag bg-primary-container text-on-primary">{ev.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-space text-xl font-bold uppercase mb-4 truncate">{ev.title}</h3>
                  <div className="grid grid-cols-2 gap-y-3 font-mono text-nav-mono text-on-surface-variant border-t border-outline-variant pt-4">
                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-sm">calendar_today</span><span>{ev.date}</span></div>
                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary-container text-sm">location_on</span><span>{ev.venue}</span></div>
                    <div className={`flex items-center gap-2 col-span-2 ${ev.soldOut ? 'text-error' : 'text-primary'}`}>
                      <span className="material-symbols-outlined text-sm">{ev.soldOut ? 'error' : 'group'}</span>
                      <span>{ev.soldOut ? 'SOLD OUT' : `${ev.seats} SEATS REMAINING`}</span>
                    </div>
                  </div>
                  <Link to="/login" className={`block w-full mt-5 py-3 text-center font-mono text-nav-mono uppercase transition-all ${ev.soldOut ? 'border border-outline-variant text-on-surface-variant cursor-not-allowed' : 'border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary'}`}>
                    {ev.soldOut ? 'JOIN WAITLIST' : 'SECURE ACCESS'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplace Preview */}
        <section id="marketplace" className="px-6 py-24 bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-mono text-label-mono text-secondary uppercase mb-2">Campus Economy</p>
              <h2 className="font-space text-headline-xl font-bold uppercase tracking-tighter">Marketplace <span className="text-secondary">Core</span></h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCTS_DATA.map((p) => (
                <div key={p.title} className="mechanical-border bg-surface-container p-1 group pink-hover cursor-pointer">
                  <div className="relative bg-[#0a0a0a] aspect-square mb-3">
                    <img src={p.img} alt={p.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-secondary-container text-on-secondary font-mono text-[9px] px-2 py-0.5 uppercase">AI Match {p.ai}%</span>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <p className="font-mono text-[9px] text-on-surface-variant mb-1 uppercase">{p.cat}</p>
                    <h4 className="font-mono text-nav-mono uppercase mb-2 truncate text-[11px]">{p.title}</h4>
                    <div className="flex items-center justify-between border-t border-outline-variant pt-2">
                      <span className="font-space text-lg font-bold text-primary-container">{p.price}</span>
                      <button className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-xl">shopping_cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">VIEW FULL MARKETPLACE <span className="material-symbols-outlined">arrow_forward</span></Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-6 py-24 bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-space text-headline-lg font-bold text-center uppercase mb-12">System Intel <span className="text-primary-container">(FAQ)</span></h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="mechanical-border overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 bg-surface-container hover:bg-surface-container-high transition-colors text-left font-mono text-nav-mono uppercase">
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 py-5 font-body text-body-sm text-on-surface-variant bg-surface">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t-2 border-outline-variant px-6 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <span className="font-space text-2xl font-bold text-primary-container tracking-tighter">EVENTHUB</span>
            <p className="mt-3 font-mono text-label-mono text-on-surface-variant uppercase">Engineering the Campus Social Experience.</p>
          </div>
          {[
            { title: 'Directory', links: ['DASHBOARD', 'EVENTS GRID', 'CLUBS PORTAL', 'MARKETPLACE'] },
            { title: 'Support', links: ['HELP CENTER', 'API ACCESS', 'SECURITY REPORT', 'TERMS OF OPS'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-mono text-nav-mono text-primary uppercase mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(l => <li key={l}><Link to="/login" className="font-body text-body-sm text-on-surface-variant hover:text-primary-container transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-mono text-nav-mono text-primary uppercase mb-5">Node Status</h4>
            <div className="flex items-center gap-2 text-primary">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
              </span>
              <span className="font-mono text-label-mono uppercase tracking-widest">System Online</span>
            </div>
            <p className="mt-3 font-mono text-[10px] text-outline uppercase">Uptime: 99.98% / Build 4.2.0</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center font-mono text-[11px] text-outline uppercase tracking-[0.2em]">
          <p>© 2025 EVENTHUB. ALL PROTOCOLS OBSERVED.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {['DISCORD', 'GITHUB', 'INSTAGRAM'].map(s => <a key={s} href="#" className="hover:text-primary transition-colors">{s}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
