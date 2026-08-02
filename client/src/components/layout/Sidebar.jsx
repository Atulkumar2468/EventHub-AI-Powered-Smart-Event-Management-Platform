import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'DASHBOARD', icon: 'dashboard', path: '/dashboard' },
  { label: 'DISCOVER', icon: 'explore', path: '/events' },
  { label: 'CLUBS', icon: 'groups', path: '/clubs' },
  { label: 'MARKETPLACE', icon: 'shopping_bag', path: '/marketplace' },
  { label: 'AI MATCHES', icon: 'psychology', path: '/ai' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); onClose?.(); };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-sidebar bg-surface border-r-2 border-outline-variant flex flex-col py-6 px-4 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link to="/dashboard" onClick={onClose}>
              <h1 className="font-space text-2xl font-bold text-primary-container tracking-tighter leading-none">EVENTHUB</h1>
            </Link>
            <p className="font-mono text-[10px] text-outline tracking-[0.3em] uppercase mt-1">Campus Command</p>
          </div>
          {/* Close button for mobile */}
          <button className="md:hidden text-on-surface-variant hover:text-primary" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-grow space-y-0.5">
          {navItems.map(({ label, icon, path }) => (
            <Link 
              key={path} 
              to={path} 
              onClick={onClose}
              className={`sidebar-link ${pathname === path || (path !== '/dashboard' && pathname.startsWith(path)) ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined text-xl" style={pathname === path ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
              <span className="tracking-widest text-[11px]">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-0.5 border-t border-outline-variant pt-4">
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-primary-container flex items-center justify-center text-on-primary font-mono text-[11px] font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-mono text-[11px] text-primary truncate uppercase">{user.name?.split(' ')[0]}</p>
                <p className="font-mono text-[9px] text-outline uppercase">{user.branch || 'Student'}</p>
              </div>
            </div>
          )}
          <Link to="/dashboard" onClick={onClose} className="sidebar-link">
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="tracking-widest text-[11px]">HELP</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link w-full text-left">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="tracking-widest text-[11px]">LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
