import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) { toast.success('ACCESS GRANTED'); navigate('/dashboard'); }
    else toast.error(result.error || 'Login failed');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <nav className="h-header border-b-2 border-outline-variant flex items-center px-6">
        <Link to="/" className="font-space text-2xl font-bold text-primary-container tracking-tighter">EVENTHUB</Link>
      </nav>
      <div className="flex-grow flex items-center justify-center px-4 grid-bg">
        <div className="w-full max-w-md">
          <div className="mechanical-border bg-surface-container p-8">
            <div className="mb-8">
              <p className="font-mono text-label-mono text-primary-container uppercase tracking-widest mb-2">AUTH MODULE</p>
              <h1 className="font-space text-4xl font-bold uppercase tracking-tighter">SYSTEM<br /><span className="text-primary-container">LOGIN</span></h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-mono text-label-mono text-on-surface-variant uppercase block mb-2">Email</label>
                <input type="email" placeholder="you@example.com" required
                  className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="font-mono text-label-mono text-on-surface-variant uppercase block mb-2">Password</label>
                <input type="password" placeholder="••••••••" required
                  className="input-field" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-center disabled:opacity-50">
                {loading ? <><span className="material-symbols-outlined animate-spin">refresh</span>AUTHENTICATING...</> : <><span className="material-symbols-outlined">login</span>AUTHENTICATE</>}
              </button>
            </form>
            <div className="mt-6 text-center border-t border-outline-variant pt-6">
              <p className="font-mono text-label-mono text-on-surface-variant uppercase">New to the Hub?</p>
              <Link to="/register" className="font-mono text-nav-mono text-primary-container uppercase hover:underline mt-1 inline-block">CREATE ACCOUNT →</Link>
            </div>
          </div>
          <p className="text-center font-mono text-[10px] text-outline uppercase mt-4 tracking-widest">SECURED WITH AES-256 ENCRYPTION</p>
        </div>
      </div>
    </div>
  );
}
