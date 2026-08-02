import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import toast from 'react-hot-toast';

const PULSE = [
  { text: 'HackMIT registrations are now 90% full. Secure your spot!', time: '2 mins ago', color: 'bg-primary' },
  { text: 'Robotics Lab updated their project showcase schedule.', time: '15 mins ago', color: 'bg-secondary' },
  { text: 'New marketplace listing: "RTX 3060 - Slightly used". Check Market.', time: '1 hour ago', color: 'bg-tertiary-container' },
];

const QUICK_ACTIONS = [
  { label: 'New Listing', icon: 'edit_square', path: '/marketplace' },
  { label: 'Browse Tickets', icon: 'confirmation_number', path: '/events' },
  { label: 'Join Club', icon: 'group_add', path: '/clubs' },
  { label: 'AI Matches', icon: 'psychology', path: '/ai' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getDashboard()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const user = data?.user;
  const tickets = data?.upcomingTickets || [];
  const recs = data?.recommendations || [];

  return (
    <ProtectedLayout>
      <div className="p-6 min-h-screen">
        {/* Greeting */}
        <section className="mb-8 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-label-mono text-primary-container uppercase tracking-widest mb-2 block">
                System Online // Session {Math.floor(Math.random() * 999) + 100}
              </span>
              <h2 className="font-space text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none">
                WELCOME BACK,<br />
                <span className="text-primary-container">{user?.name?.toUpperCase() || 'COMMANDER'}</span>
              </h2>
            </div>
            <div className="flex gap-3">
              <Link to="/marketplace" className="btn-primary flex items-center gap-2 py-2.5 text-[11px]">
                <span className="material-symbols-outlined text-lg">add_circle</span>CREATE LISTING
              </Link>
              <Link to="/clubs" className="btn-cyan flex items-center gap-2 py-2.5 text-[11px]">JOIN CLUB</Link>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Participation Score', val: user?.participationScore || 84.2, suffix: '', sub: '+12.4%', subColor: 'text-secondary', icon: 'leaderboard', bar: 84 },
            { label: 'Total XP', val: (user?.xp || 12450).toLocaleString(), suffix: '', sub: `LVL ${user?.level || 24}`, subColor: 'text-outline', icon: 'bolt', bar: 65 },
            { label: 'Leaderboard Rank', val: `#${user?.leaderboardRank || 12}`, suffix: '', sub: 'TOP 2%', subColor: 'text-outline', icon: 'workspace_premium', bar: null },
          ].map(({ label, val, sub, subColor, icon, bar }) => (
            <div key={label} className="mechanical-border bg-surface-container p-5 relative overflow-hidden group neon-hover">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">{icon}</span>
              </div>
              <p className="font-mono text-outline text-[11px] mb-1 uppercase">{label}</p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl text-primary-container font-bold">{val}</span>
                <span className={`font-mono text-[11px] ${subColor}`}>{sub}</span>
              </div>
              {bar !== null && (
                <div className="mt-3 h-0.5 w-full bg-surface-container-highest">
                  <div className="h-full bg-primary-container transition-all duration-1000" style={{ width: `${bar}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Upcoming Tickets */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">UPCOMING TICKETS</h3>
            <Link to="/events" className="font-mono text-[11px] text-outline hover:text-primary uppercase flex items-center gap-1">VIEW ALL <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
          </div>
          {loading ? (
            <div className="flex gap-4">
              {[1,2,3].map(i => <div key={i} className="min-w-[320px] h-36 bg-surface-container mechanical-border animate-pulse"></div>)}
            </div>
          ) : tickets.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {tickets.map((reg, i) => (
                <Link key={i} to={`/events/${reg.event?._id}`}
                  className="min-w-[320px] mechanical-border bg-surface-container-low flex h-36 group neon-hover flex-shrink-0 relative overflow-hidden cursor-pointer">
                  <div className="w-1/3 bg-surface-container-highest overflow-hidden p-2">
                    <img src={reg.event?.image || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between relative">
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a0a] rounded-full border border-outline-variant"></div>
                    <div>
                      <p className="font-mono text-primary-container text-[10px] uppercase">{reg.event?.category}</p>
                      <h4 className="font-space text-base font-bold uppercase truncate">{reg.event?.title}</h4>
                      <p className="font-mono text-outline text-[10px] mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_month</span>
                        {new Date(reg.event?.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-mono text-[9px] bg-primary/10 text-primary px-2 py-0.5">{reg.event?.venue}</span>
                      <button onClick={e => { e.preventDefault(); toast.success(`Ticket: ${reg.ticketId}`); }}
                        className="bg-primary-container text-on-primary p-1.5 active:scale-90 transition-transform z-10">
                        <span className="material-symbols-outlined text-sm">qr_code_2</span>
                      </button>
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="font-mono text-[10px] text-primary-container uppercase tracking-widest bg-surface-container px-3 py-1 border border-primary/30">VIEW EVENT →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mechanical-border bg-surface-container p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline">confirmation_number</span>
              <p className="font-mono text-label-mono text-outline uppercase mt-3">No upcoming tickets. Explore events to register!</p>
              <Link to="/events" className="btn-cyan inline-flex mt-4 py-2 text-[11px]">BROWSE EVENTS</Link>
            </div>
          )}
        </section>

        {/* Recommendations + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-5">
              <h3 className="section-title border-l-4 border-secondary-container">FOR YOU</h3>
              <div className="flex items-center gap-2 bg-secondary-container/10 px-3 py-1 border border-secondary-container/30">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-mono text-[10px] text-secondary uppercase">AI Engine</span>
              </div>
            </div>
            <div className="space-y-3">
              {(recs.slice(0, 3)).map((ev, i) => (
                <Link key={i} to={`/events/${ev._id}`} className="mechanical-border bg-surface-container p-1 group pink-hover block">
                  <div className="flex items-center gap-4 p-3 bg-surface-container-high">
                    <div className="w-16 h-16 bg-surface-container-highest flex-shrink-0 overflow-hidden">
                      <img src={ev.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-space font-bold uppercase group-hover:text-secondary transition-colors truncate">{ev.title}</h5>
                        <span className="font-mono text-[10px] text-secondary-container bg-secondary-container/10 px-2 py-1 whitespace-nowrap">{Math.floor(75 + Math.random() * 23)}% AI MATCH</span>
                      </div>
                      <p className="font-body text-body-sm text-outline line-clamp-1 mt-0.5">{ev.description || `${ev.category} event at ${ev.venue}`}</p>
                      <div className="mt-1 flex gap-3">
                        <span className="font-mono text-[10px] text-primary flex items-center gap-1 uppercase"><span className="material-symbols-outlined text-xs">location_on</span>{ev.venue}</span>
                        <span className="font-mono text-[10px] text-outline flex items-center gap-1 uppercase"><span className="material-symbols-outlined text-xs">payments</span>{ev.price > 0 ? `₹${ev.price}` : 'FREE'}</span>
                      </div>
                    </div>
                    <button className="bg-secondary text-on-secondary px-3 py-2 font-mono text-[11px] uppercase active:scale-95 flex-shrink-0">JOIN</button>
                  </div>
                </Link>
              ))}
              {recs.length === 0 && (
                <div className="mechanical-border bg-surface-container p-6 text-center">
                  <p className="font-mono text-label-mono text-outline uppercase">No recommendations yet. Explore more!</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="section-title border-l-4 border-outline mb-5">QUICK ACTIONS</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map(({ label, icon, path }) => (
                  <Link key={label} to={path} className="mechanical-border bg-surface-container aspect-square flex flex-col items-center justify-center gap-2 group neon-hover">
                    <span className="material-symbols-outlined text-3xl text-outline group-hover:text-primary transition-colors">{icon}</span>
                    <span className="font-mono text-[10px] uppercase text-outline group-hover:text-primary text-center leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="section-title border-l-4 border-outline mb-5">CAMPUS PULSE</h3>
              <div className="mechanical-border bg-surface-container p-4 space-y-3">
                {PULSE.map((p, i) => (
                  <div key={i}>
                    {i > 0 && <div className="h-px bg-outline-variant my-3"></div>}
                    <div className="flex gap-3">
                      <div className={`w-1 h-8 flex-shrink-0 ${p.color}`}></div>
                      <div>
                        <p className="font-mono text-[10px] text-outline uppercase">{p.time}</p>
                        <p className="font-body text-body-sm text-on-surface">{p.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedLayout>
  );
}
