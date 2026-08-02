import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Tech', 'Robotics', 'Coding', 'Cultural', 'Sports', 'Seminar', 'Workshop', 'Other'];

const FALLBACK = [
  { _id: '1', title: 'CYBERPUNK 2025 SUMMIT', category: 'Tech', date: new Date(Date.now()+7*86400000), venue: 'AUDITORIUM-A', totalSeats: 200, registeredCount: 188, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K', status: 'upcoming', price: 0 },
  { _id: '2', title: 'BATTLE BOTS: ELITE', category: 'Robotics', date: new Date(Date.now()+10*86400000), venue: 'ARENA 3', totalSeats: 100, registeredCount: 100, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E', status: 'upcoming', price: 0 },
  { _id: '3', title: '24H HACKER SPRINT', category: 'Coding', date: new Date(Date.now()+14*86400000), venue: 'C-LABS', totalSeats: 150, registeredCount: 105, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf0JTtXgxnMaH5ms_d3V59KDDAINM1SSL67AcQKcoyNrIkcNkMcjO5doSxMeJuLft_GwaCiujZn0Csv0S8GGZywBz_PLO5mkEJqCXR_ZiqvDnBoW8HeJHD7LfFOEIuhiHP949EeAEjdUC6fT7-vnSZnIPX4ayFOHmyjYTwtdAkKCK_MCW_BQTXRgkR4KwZaujfp7zhG1bXm_cK4vFU00JzxrhKu-L6TGAR4xsYD-yaQPcAjMZRQXump70aZBvaC2WR9wavFcK8WQzw', status: 'upcoming', price: 0 },
  { _id: '4', title: 'NEURAL NETWORK WORKSHOP', category: 'Workshop', date: new Date(Date.now()+3*86400000), venue: 'ML LAB', totalSeats: 40, registeredCount: 10, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me', status: 'live', price: 100 },
  { _id: '5', title: 'FORMULA STUDENT EXPO', category: 'Sports', date: new Date(Date.now()+20*86400000), venue: 'WPU ARENA', totalSeats: 500, registeredCount: 250, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9V6NNoXOOBMl0gLlzu-rGQLJUHrY8YDk_FGXT8rhctZVH6Wwd6ecE5BNmv5Z_KkYF7LQH6wJb3QbPj1fK8oDWsJnIVkgtyPf2ki1QM5TBqmQwD1miDcqX4nQPSrrxs1VX7EbHjf0O-9K_3_mbK7mrN_6b0YsodrJ9DSHaWycZHApm_kUTdVE4Nfz5n-JZhNaxKx1TA6GhlwXfi0fU6F2tIprXEXditKJVCI1k-hD763q5abQoTJx9vp-ZesdkNeNV9McX-qtdwcp', status: 'upcoming', price: 0 },
  { _id: '6', title: 'URBAN DESIGN SEMINAR', category: 'Seminar', date: new Date(Date.now()+25*86400000), venue: 'MAIN AUD', totalSeats: 300, registeredCount: 120, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk', status: 'upcoming', price: 200 },
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [registering, setRegistering] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
    fetchEvents();
  }, []);

  const fetchEvents = async (cat, q) => {
    setLoading(true);
    try {
      const params = {};
      if (cat && cat !== 'All') params.category = cat;
      if (q) params.search = q;
      const { data } = await eventsAPI.getAll(params);
      setEvents(data.length > 0 ? data : FALLBACK);
    } catch {
      setEvents(FALLBACK);
    } finally { setLoading(false); }
  };

  const handleCategory = (cat) => { setActiveCategory(cat); fetchEvents(cat, search); };
  const handleSearch = (e) => { e.preventDefault(); fetchEvents(activeCategory, search); };

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      await eventsAPI.register(eventId);
      toast.success('REGISTERED SUCCESSFULLY! Check dashboard for ticket.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setRegistering(null); }
  };

  const getSeatsStatus = (ev) => {
    const rem = ev.totalSeats - ev.registeredCount;
    if (rem <= 0) return { text: 'SOLD OUT', color: 'text-error' };
    if (rem < 20) return { text: `${rem} SEATS REMAINING`, color: 'text-primary' };
    return { text: `${rem} SEATS REMAINING`, color: 'text-primary' };
  };

  return (
    <ProtectedLayout>
      <div className="p-6">
        <div className="mb-8">
          <p className="font-mono text-label-mono text-primary-container uppercase tracking-widest mb-1">DISCOVER MODULE</p>
          <h1 className="font-space text-4xl font-bold uppercase tracking-tighter">EVENT <span className="text-primary-container">GRID</span></h1>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-grow max-w-lg">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="input-field pl-10" placeholder="SEARCH EVENTS..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary py-2 px-5 text-[11px]">SCAN</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategory(cat)}
                className={`tag border transition-all ${activeCategory === cat ? 'bg-primary-container text-on-primary border-primary-container' : 'border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-surface-container mechanical-border animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(ev => {
              const seats = getSeatsStatus(ev);
              const soldOut = ev.registeredCount >= ev.totalSeats;
              return (
                <div key={ev._id} className="mechanical-border bg-surface-container group neon-hover flex flex-col">
                  <Link to={`/events/${ev._id}`} className="block">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="tag bg-primary-container text-on-primary">{ev.category}</span>
                        {ev.status === 'live' && <span className="tag bg-error text-on-error rounded-full animate-pulse">● LIVE</span>}
                      </div>
                      {ev.price > 0 && <div className="absolute bottom-3 right-3"><span className="tag bg-[#0a0a0a] border border-outline-variant text-primary-container">₹{ev.price}</span></div>}
                    </div>
                    <div className="p-5 flex-grow">
                      <h3 className="font-space text-lg font-bold uppercase mb-3 truncate">{ev.title}</h3>
                      <div className="grid grid-cols-2 gap-y-2 font-mono text-[11px] text-on-surface-variant border-t border-outline-variant pt-3">
                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary-container text-sm">calendar_today</span><span>{new Date(ev.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}</span></div>
                        <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary-container text-sm">location_on</span><span className="truncate">{ev.venue}</span></div>
                        <div className={`flex items-center gap-1.5 col-span-2 ${seats.color}`}><span className="material-symbols-outlined text-sm">{soldOut ? 'error' : 'group'}</span><span>{seats.text}</span></div>
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-5">
                    <button onClick={() => !soldOut && handleRegister(ev._id)} disabled={soldOut || registering === ev._id}
                      className={`w-full py-2.5 font-mono text-nav-mono uppercase transition-all text-[11px] ${soldOut ? 'border border-outline-variant text-on-surface-variant cursor-not-allowed' : 'border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary active:scale-95'}`}>
                      {registering === ev._id ? 'REGISTERING...' : soldOut ? 'JOIN WAITLIST' : 'SECURE ACCESS'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="mechanical-border bg-surface-container p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline">search_off</span>
            <p className="font-mono text-label-mono text-outline uppercase mt-3">No events found. Try a different filter.</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
