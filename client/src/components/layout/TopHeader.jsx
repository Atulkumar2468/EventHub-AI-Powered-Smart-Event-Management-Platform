import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopHeader({ onMenuToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/events?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="fixed top-0 right-0 h-header w-full md:w-[calc(100%-240px)] bg-surface border-b-2 border-outline-variant flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-3 flex-grow max-w-xl">
        {/* Toggle Button for mobile */}
        <button onClick={onMenuToggle} className="md:hidden text-on-surface-variant hover:text-primary active:scale-95 transition-all">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <form onSubmit={handleSearch} className="w-full">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input
              className="input-field pl-10"
              placeholder="COMMAND SEARCH..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 ml-2">
        <button className="relative text-on-surface-variant hover:text-primary transition-all active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-container rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-outline-variant"></div>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="text-right hidden sm:block">
            <p className="font-mono text-nav-mono text-primary uppercase">{user?.name?.split(' ')[0] || 'USER'}</p>
            <p className="font-mono text-[10px] text-outline uppercase">{user?.branch || 'B.Tech'} / Yr {user?.year || 1}</p>
          </div>
          <div className="w-10 h-10 border border-primary bg-surface-container flex items-center justify-center text-primary-container font-space font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
