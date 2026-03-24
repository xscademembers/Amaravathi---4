import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError(
        'Could not reach the API (port 5000). Stop the dev server and run npm run dev again — it starts both the website and the API.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-maroon font-bold text-2xl mx-auto mb-4">A</div>
          <h1 className="text-3xl font-serif text-white mb-2">Admin Panel</h1>
          <p className="text-white/40 text-sm">Amaravathi Conventions Management</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 block mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-white/5 border border-white/10 pl-11 pr-11 py-4 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-gold transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-maroon py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8 uppercase tracking-widest">
          &copy; 2026 Amaravathi Conventions
        </p>
      </div>
    </div>
  );
}
