import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clubsAPI } from '../services/api';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK_CLUBS = [
  { _id: '1', name: 'NEURAL NETWORK CLUB', category: 'AI / ML', memberCount: 240, activityLevel: 'HIGH', description: 'Deep dive into LLMs and generative AI frameworks. The campus AI powerhouse.', tags: ['ML', 'AI', 'NLP'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDofOioaNCF-Dq4RyTmpzGRRKlf6fhJAMhnMPl3qsKWppVKl4BZERIFpp-0lubDUkjOMd_w8Zqk5O-o71yAYo2QqoCGgWa4696gbdCu5oYzxywjlzUkuJ_7DTCy9JfvU669IXnkjonenS6fURRYbash9PJmJ5bT_tXaCSf7S7rDVNvq5p-8nJp5wA64KARG8jw2-JRkDlfm9ssnygir_9vF4TxHVnvwIYzGbCrrieqD8xi4u7OYzpIrZ4VWtU17LyXwgQXzhlOn_Me' },
  { _id: '2', name: 'FORMULA RACING TEAM', category: 'Engineering', memberCount: 85, activityLevel: 'HIGH', description: 'Building high-performance EV race cars and competing in Formula Student.', tags: ['EV', 'Formula', 'Mechanical'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf9V6NNoXOOBMl0gLlzu-rGQLJUHrY8YDk_FGXT8rhctZVH6Wwd6ecE5BNmv5Z_KkYF7LQH6wJb3QbPj1fK8oDWsJnIVkgtyPf2ki1QM5TBqmQwD1miDcqX4nQPSrrxs1VX7EbHjf0O-9K_3_mbK7mrN_6b0YsodrJ9DSHaWycZHApm_kUTdVE4Nfz5n-JZhNaxKx1TA6GhlwXfi0fU6F2tIprXEXditKJVCI1k-hD763q5abQoTJx9vp-ZesdkNeNV9McX-qtdwcp' },
  { _id: '3', name: 'VISUAL STORYTELLERS', category: 'Arts / Media', memberCount: 110, activityLevel: 'MEDIUM', description: 'Photography, filmmaking, and creative storytelling for the digital age.', tags: ['Film', 'Photo', 'Design'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzkGj7s8ykNTzCT3rRHTXmBE5456MPRC0QTEjHw0PgMVBw1k6fEupz9Rmuz5N4IfWOFh_UgfFJ-tBpDg9M36M3ur34gl9tVH0-rUVOpGLTxmaz9Pi5tuuPwXGw9XINI2XZIOch1g4EbrqmcpmvWQEIJawJcEYKcVw-SwJ0r_GvmYBSvEd-Sqs1eSvkOeukaks4Ll3kcASh1V4_Qo3NlgnhBO_frXx9vmslBdmWpUupR-Wg3bT-Q6XbdnHW30zc0jgE4n9lIxKimwk' },
  { _id: '4', name: 'ROBOTICS BRIGADE', category: 'Robotics', memberCount: 65, activityLevel: 'HIGH', description: 'Building autonomous robots for national-level competitions and innovation challenges.', tags: ['Robotics', 'IoT', 'Arduino'], banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcWJtBYn1rktOhKqRPOXahN2z2chqpHiLmHYf7aZzS38V4NgrYM9kScGEwInGWW-0xGP_aNdEt43u8kPveNV1kfsQeEBg0JuskqEWmqN0E4GeTy5iTjOggpgMoxjrhgLzUL9BEi55znttUx93kHUgmtHoMzx_YDISPsrQbsHguXq6BasquXyTI1iGxPhvojbUtW24-_nJYGEpIB8F07ELzBB1B_-qTdKWSFbS_67TW3Dw0MVeLuZg1Ve8-NazseXh9-dlmYu8s6M1E' },
];

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    clubsAPI.getAll()
      .then(r => setClubs(r.data.length > 0 ? r.data : FALLBACK_CLUBS))
      .catch(() => setClubs(FALLBACK_CLUBS))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    clubsAPI.getAll({ search })
      .then(r => setClubs(r.data.length > 0 ? r.data : FALLBACK_CLUBS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleJoin = async (clubId, e) => {
    e.preventDefault();
    try {
      await clubsAPI.join(clubId);
      toast.success('Joined! +100 XP');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join');
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-6">
        <div className="mb-8">
          <p className="font-mono text-label-mono text-primary-container uppercase tracking-widest mb-1">CLUBS PORTAL</p>
          <h1 className="font-space text-4xl font-bold uppercase tracking-tighter">CAMPUS <span className="text-primary-container">CLUBS</span></h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="input-field pl-10" placeholder="SEARCH CLUBS..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary py-2 px-5 text-[11px]">SCAN</button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-surface-container mechanical-border animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clubs.map(club => (
              <Link key={club._id} to={`/clubs/${club._id}`} className="mechanical-border bg-surface-container group neon-hover block overflow-hidden">
                <div className="relative h-36 overflow-hidden">
                  <img src={club.banner} alt={club.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#192122] via-transparent"></div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`tag rounded-full text-[9px] ${club.activityLevel === 'HIGH' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface-container text-outline border border-outline-variant'}`}>
                      ● {club.activityLevel}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-[10px] text-on-surface-variant uppercase mb-1">{club.category}</p>
                      <h3 className="font-space text-xl font-bold uppercase">{club.name}</h3>
                    </div>
                    <button onClick={(e) => handleJoin(club._id, e)}
                      className="bg-primary-container text-on-primary px-3 py-1.5 font-mono text-[10px] uppercase hover:brightness-110 active:scale-95 transition-all flex-shrink-0">
                      JOIN
                    </button>
                  </div>
                  <p className="font-body text-body-sm text-outline line-clamp-2 mb-3">{club.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-primary flex items-center gap-1 uppercase">
                      <span className="material-symbols-outlined text-sm">group</span>{club.memberCount} Members
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(club.tags || []).slice(0,2).map(tag => <span key={tag} className="tag border border-outline-variant text-outline text-[9px]">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
