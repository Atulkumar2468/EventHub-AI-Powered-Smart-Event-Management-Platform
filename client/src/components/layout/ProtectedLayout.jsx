import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function ProtectedLayout({ children }) {
  const { user, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="md:ml-sidebar mt-header min-h-[calc(100vh-64px)] grid-bg">
        {children}
      </main>
      <FAB />
    </div>
  );
}

function FAB() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: 'add_shopping_cart', label: 'New Listing', hint: 'Sell something', href: '/marketplace' },
    { icon: 'event', label: 'Browse Events', hint: 'Find events', href: '/events' },
    { icon: 'psychology', label: 'AI Assistant', hint: 'Ask campus AI', href: '/ai' },
    { icon: 'groups', label: 'Find Clubs', hint: 'Join a club', href: '/clubs' },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {open && (
          <div className="flex flex-col items-end gap-2 mb-1">
            {actions.map((action, i) => (
              <Link key={action.href} to={action.href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 group"
                style={{ animation: `fabIn 0.15s ease ${i * 0.05}s both` }}>
                <div className="bg-surface-container border border-outline-variant px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-mono text-[10px] text-on-surface uppercase whitespace-nowrap">{action.label}</p>
                  <p className="font-mono text-[9px] text-outline uppercase">{action.hint}</p>
                </div>
                <div className="w-11 h-11 bg-surface-container border border-outline-variant text-primary-container flex items-center justify-center hover:bg-primary-container hover:text-on-primary transition-all shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                  <span className="material-symbols-outlined text-xl">{action.icon}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <button onClick={() => setOpen(o => !o)}
          className="w-14 h-14 bg-primary-container text-on-primary shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Quick Actions">
          <span className={`material-symbols-outlined text-2xl transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>add</span>
        </button>
      </div>

      <style>{`@keyframes fabIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </>
  );
}
