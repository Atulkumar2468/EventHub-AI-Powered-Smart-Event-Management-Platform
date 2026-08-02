import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BRANCHES = ['B.Tech CS', 'B.Tech IT', 'B.Tech ECE', 'B.Tech Mech', 'B.Tech Civil', 'BBA', 'MBA', 'MCA', 'Other'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: '', year: '1' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) { toast.success('ACCOUNT INITIALIZED'); navigate('/dashboard'); }
    else toast.error(result.error || 'Registration failed');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <nav className="h-header border-b-2 border-outline-variant flex items-center px-6">
        <Link to="/" className="font-space text-2xl font-bold text-primary-container tracking-tighter">EVENTHUB</Link>
      </nav>
      <div className="flex-grow flex items-center justify-center px-4 py-12 grid-bg">
        <div className="w-full max-w-md">
          <div className="mechanical-border bg-surface-container p-8">
            <div className="mb-8">
              <p className="font-mono text-label-mono text-primary-container uppercase tracking-widest mb-2">INIT MODULE</p>
              <h1 className="font-space text-4xl font-bold uppercase tracking-tighter">CREATE<br /><span className="text-primary-container">ACCOUNT</span></h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Aryan Sharma' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="font-mono text-label-mono text-on-surface-variant uppercase block mb-2">{label}</label>
                  <input type={type} placeholder={placeholder} required
                    className="input-field" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-label-mono text-on-surface-variant uppercase block mb-2">Branch</label>
                  <select className="input-field" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>
                    <option value="">Select...</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-label-mono text-on-surface-variant uppercase block mb-2">Year</label>
                  <select className="input-field" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-surface-container-high border border-outline-variant p-3">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase">
                  <span className="material-symbols-outlined text-primary-container text-sm align-middle mr-1">verified</span>
                  Use your college email to register
                </p>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><span className="material-symbols-outlined animate-spin">refresh</span>INITIALIZING...</> : <><span className="material-symbols-outlined">person_add</span>INITIALIZE ACCOUNT</>}
              </button>
            </form>
            <div className="mt-6 text-center border-t border-outline-variant pt-5">
              <p className="font-mono text-label-mono text-on-surface-variant uppercase">Already in the Hub?</p>
              <Link to="/login" className="font-mono text-nav-mono text-primary-container uppercase hover:underline mt-1 inline-block">LOGIN →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
