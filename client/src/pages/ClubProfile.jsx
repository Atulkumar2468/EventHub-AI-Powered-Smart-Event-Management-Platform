import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clubsAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK = {
  _id: '1', name: 'NEURAL NETWORK CLUB', category: 'AI / ML',
  description: 'The campus epicenter for all things Artificial Intelligence and Machine Learning. We host workshops, research sessions, and build real-world AI projects. From LLMs to computer vision — if it\'s intelligent, we\'re in.',
  banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me',
  memberCount: 240, activityLevel: 'HIGH', tags: ['Machine Learning', 'Deep Learning', 'NLP', 'Vision', 'GenAI'],
  admin: { name: 'Prof. Mehta' }, members: [],
  events: [
    { _id: 'e1', title: 'LLM FINE-TUNING WORKSHOP', category: 'Workshop', date: new Date(Date.now()+5*86400000), venue: 'ML LAB', totalSeats: 40, registeredCount: 35, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me' },
    { _id: 'e2', title: 'COMPUTER VISION HACKATHON', category: 'Coding', date: new Date(Date.now()+12*86400000), venue: 'CS LAB', totalSeats: 60, registeredCount: 20, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACARhGI58H-NsIOQJ3M-zRJ21JmX2FUETuXGy2AazZYMa4_z_b9KlfAbgAf9WmF5XMDWH6_vNfOosWz6wrQEkxMNuynDGJYsH_sbr4wu1Kp-9uxeZTR3mRdDx-6r5O26JhnCcUTIasuQjI2iyGLY7T25qmrVwcjGIbJ1IZsOISG3bjtGjsQcg4WyhF4LWKmVC8Xl4QACCZPJhu2kF6Li9JJXZHevfhvw_c1GUdWzP6PNNC7NQYev2dxEM4I_Q8Zpjrb1WNxDxPAI7K' },
  ],
  socialLinks: { instagram: '#', discord: '#', github: '#' },
};

export default function ClubProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    clubsAPI.getById(id)
      .then(r => {
        setClub(r.data);
        setIsMember(r.data.members?.some(m => m._id === user?._id || m === user?._id));
      })
      .catch(() => setClub(FALLBACK))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoinLeave = async () => {
    setJoining(true);
    try {
      if (isMember) {
        await clubsAPI.leave(id);
        toast.success('LEFT CLUB');
        setIsMember(false);
        setClub(prev => ({ ...prev, memberCount: prev.memberCount - 1 }));
      } else {
        await clubsAPI.join(id);
        toast.success('JOINED CLUB! +100 XP');
        setIsMember(true);
        setClub(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setJoining(false); }
  };

  if (loading) return <ProtectedLayout><div className="p-6"><div className="h-96 bg-surface-container mechanical-border animate-pulse"></div></div></ProtectedLayout>;

  const c = club || FALLBACK;

  return (
    <ProtectedLayout>
      <div className="p-6">
        <Link to="/clubs" className="font-mono text-label-mono text-outline hover:text-primary flex items-center gap-1 uppercase mb-6">
          <span className="material-symbols-outlined text-sm">arrow_back</span>BACK TO CLUBS
        </Link>

        {/* Banner */}
        <div className="mechanical-border mb-6 overflow-hidden">
          <div className="relative h-48 md:h-64">
            <img src={c.banner} alt={c.name} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="tag bg-primary-container text-on-primary">{c.category}</span>
                  <span className={`tag rounded-full ${c.activityLevel === 'HIGH' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface-container text-outline border border-outline-variant'}`}>
                    ● {c.activityLevel} ACTIVITY
                  </span>
                </div>
                <h1 className="font-space text-3xl md:text-4xl font-bold uppercase tracking-tighter">{c.name}</h1>
              </div>
              <button onClick={handleJoinLeave} disabled={joining}
                className={`py-3 px-8 font-mono text-nav-mono uppercase flex items-center gap-2 text-[12px] transition-all active:scale-95 ${isMember ? 'border border-error text-error hover:bg-error hover:text-on-error' : 'bg-primary-container text-on-primary hover:brightness-110'}`}>
                <span className="material-symbols-outlined">{isMember ? 'person_remove' : 'person_add'}</span>
                {joining ? '...' : isMember ? 'LEAVE CLUB' : 'JOIN CLUB'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="mechanical-border bg-surface-container p-6">
              <h2 className="section-title mb-4">ABOUT</h2>
              <p className="font-body text-body-md text-on-surface-variant leading-relaxed">{c.description}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {(c.tags || []).map(tag => <span key={tag} className="tag border border-outline-variant text-on-surface-variant">{tag}</span>)}
              </div>
            </div>

            {/* Events */}
            <div>
              <h2 className="section-title mb-5">CLUB EVENTS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(c.events || []).map(ev => (
                  <Link key={ev._id} to={`/events/${ev._id}`} className="mechanical-border bg-surface-container group neon-hover block">
                    <div className="aspect-video overflow-hidden">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="tag bg-primary-container text-on-primary text-[9px] mb-2 inline-block">{ev.category}</span>
                      <h3 className="font-space font-bold uppercase text-sm truncate">{ev.title}</h3>
                      <div className="flex gap-3 mt-2 font-mono text-[10px] text-outline uppercase">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">calendar_today</span>{new Date(ev.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span>{ev.venue}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="mechanical-border bg-surface-container p-5">
              <h3 className="section-title text-lg mb-5">STATS</h3>
              {[
                { icon: 'group', label: 'Members', val: c.memberCount },
                { icon: 'event', label: 'Events Run', val: c.events?.length || 0 },
                { icon: 'admin_panel_settings', label: 'Admin', val: c.admin?.name || 'EventHub' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 py-3 border-b border-outline-variant last:border-0">
                  <span className="material-symbols-outlined text-primary-container">{icon}</span>
                  <div>
                    <p className="font-mono text-[10px] text-outline uppercase">{label}</p>
                    <p className="font-space font-bold">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            {c.socialLinks && (
              <div className="mechanical-border bg-surface-container p-5">
                <h3 className="font-mono text-nav-mono text-on-surface-variant uppercase mb-4">CONNECT</h3>
                <div className="space-y-2">
                  {[['instagram', 'photo_camera', 'Instagram'], ['discord', 'forum', 'Discord'], ['github', 'code', 'GitHub']].map(([key, icon, label]) => (
                    c.socialLinks[key] && (
                      <a key={key} href={c.socialLinks[key]} className="flex items-center gap-3 py-2 px-3 border border-outline-variant hover:border-primary-container text-on-surface-variant hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                        <span className="font-mono text-[11px] uppercase">{label}</span>
                        <span className="material-symbols-outlined text-sm ml-auto">open_in_new</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
