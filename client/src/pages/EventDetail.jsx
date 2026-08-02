import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import toast from 'react-hot-toast';

const FALLBACK_EVENT = {
  _id: '1', title: 'CYBERPUNK 2025 SUMMIT', category: 'Tech',
  description: 'The annual flagship tech summit, bringing together industry leaders, researchers, and the best student innovators. This year\'s theme: AI-Powered Futures. Sessions include live demos, panel discussions, and a 6-hour hackathon sprint.',
  date: new Date(Date.now() + 7 * 86400000), time: '10:00 AM',
  venue: 'AUDITORIUM-A, BLOCK S', totalSeats: 200, registeredCount: 188, price: 0,
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K',
  status: 'upcoming', tags: ['AI', 'Hackathon', 'Summit'],
  club: { name: 'Neural Network Club', logo: '' },
  organizer: { name: 'Prof. Mehta' },
};

function Countdown({ date }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const diff = new Date(date) - Date.now();
      if (diff <= 0) return;
      setTime({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [date]);
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[['DAYS', time.d], ['HRS', time.h], ['MIN', time.m], ['SEC', time.s]].map(([label, val]) => (
        <div key={label} className="mechanical-border bg-surface-container-high p-3">
          <div className="font-space text-2xl font-bold text-primary-container">{String(val).padStart(2,'0')}</div>
          <div className="font-mono text-[9px] text-outline uppercase tracking-widest mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    eventsAPI.getById(id)
      .then(r => setEvent(r.data))
      .catch(() => setEvent(FALLBACK_EVENT))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await eventsAPI.register(id);
      toast.success('REGISTERED! Check your dashboard for the ticket.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not register');
    } finally { setRegistering(false); }
  };

  if (loading) return <ProtectedLayout><div className="p-6"><div className="h-96 bg-surface-container mechanical-border animate-pulse"></div></div></ProtectedLayout>;

  const ev = event || FALLBACK_EVENT;
  const seatsLeft = ev.totalSeats - ev.registeredCount;
  const soldOut = seatsLeft <= 0;

  return (
    <ProtectedLayout>
      <div className="p-6">
        <div className="mb-6">
          <Link to="/events" className="font-mono text-label-mono text-outline hover:text-primary flex items-center gap-1 uppercase mb-4">
            <span className="material-symbols-outlined text-sm">arrow_back</span>BACK TO EVENTS
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="mechanical-border overflow-hidden">
              <div className="relative aspect-video">
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="tag bg-primary-container text-on-primary">{ev.category}</span>
                  {ev.status === 'live' && <span className="tag bg-error text-on-error rounded-full animate-pulse">● LIVE NOW</span>}
                </div>
                <div className="absolute bottom-4 left-4">
                  <h1 className="font-space text-3xl md:text-4xl font-bold uppercase tracking-tighter text-white">{ev.title}</h1>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {(ev.tags || ['Tech', 'Summit', 'Hackathon']).map(tag => (
                <span key={tag} className="tag border border-outline-variant text-on-surface-variant">{tag}</span>
              ))}
            </div>

            {/* Description */}
            <div className="mechanical-border bg-surface-container p-6">
              <h2 className="section-title mb-5">EVENT BRIEF</h2>
              <p className="font-body text-body-md text-on-surface-variant leading-relaxed">{ev.description}</p>
            </div>

            {/* Organizer */}
            {ev.club && (
              <div className="mechanical-border bg-surface-container p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 border border-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-outline uppercase">Organized by</p>
                  <p className="font-space text-lg font-bold uppercase">{ev.club?.name || 'EventHub'}</p>
                </div>
                <Link to={`/clubs/${ev.club?._id || '1'}`} className="ml-auto btn-outline py-2 text-[11px]">VIEW CLUB</Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="mechanical-border bg-surface-container p-5 space-y-4">
              <h3 className="section-title text-xl">REGISTER</h3>
              
              <Countdown date={ev.date} />

              <div className="space-y-3 border-t border-outline-variant pt-4">
                {[
                  { icon: 'calendar_today', label: 'DATE', val: new Date(ev.date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) },
                  { icon: 'schedule', label: 'TIME', val: ev.time || '10:00 AM' },
                  { icon: 'location_on', label: 'VENUE', val: ev.venue },
                  { icon: 'group', label: 'SEATS', val: soldOut ? 'SOLD OUT' : `${seatsLeft} / ${ev.totalSeats} available` },
                  { icon: 'payments', label: 'ENTRY', val: ev.price > 0 ? `₹${ev.price}` : 'FREE' },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container text-lg flex-shrink-0">{icon}</span>
                    <div>
                      <p className="font-mono text-[10px] text-outline uppercase">{label}</p>
                      <p className="font-body text-body-sm text-on-surface">{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Capacity bar */}
              <div>
                <div className="flex justify-between font-mono text-[10px] text-outline uppercase mb-1">
                  <span>Capacity</span>
                  <span>{Math.round((ev.registeredCount / ev.totalSeats) * 100)}% FULL</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest">
                  <div className={`h-full transition-all ${soldOut ? 'bg-error' : 'bg-primary-container'}`} style={{ width: `${Math.min(100, (ev.registeredCount / ev.totalSeats) * 100)}%` }}></div>
                </div>
              </div>

              <button onClick={handleRegister} disabled={soldOut || registering}
                className={`w-full py-3.5 font-mono text-nav-mono uppercase transition-all text-[11px] ${soldOut ? 'border border-outline-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary-container text-on-primary hover:brightness-110 active:scale-95 neon-glow'}`}>
                {registering ? 'REGISTERING...' : soldOut ? 'JOIN WAITLIST' : `SECURE ACCESS${ev.price > 0 ? ' — ₹' + ev.price : ' — FREE'}`}
              </button>
            </div>

            {/* Share */}
            <div className="mechanical-border bg-surface-container p-5">
              <h3 className="font-mono text-nav-mono text-on-surface-variant uppercase mb-3">Share Intel</h3>
              <div className="flex gap-2">
                {['share', 'bookmark', 'notifications'].map(icon => (
                  <button key={icon} className="flex-1 py-2 border border-outline-variant hover:border-primary-container text-on-surface-variant hover:text-primary transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
