import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@mtechnovate.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative tech-grid-bg transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white p-1 border border-cyan-500/40 shadow-xl shadow-brand-500/20">
            <img src="/logo.jpg" alt="M TECHNOVATE SOLUTIONS" className="w-full h-full object-contain" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            M TECHNOVATE PORTAL
          </h2>
          <p className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-mono mt-1 font-semibold">
            Enterprise ATS & Administration Console
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass-card py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-600 hover:to-cyan-600 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-center">
              <Link to="/" className="text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                ← Return to Public Website
              </Link>
            </div>

          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-200/70 dark:bg-dark-900/60 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 text-center font-mono">
            Default credentials: <span className="text-cyan-700 dark:text-cyan-300 font-semibold">admin@mtechnovate.com</span> / <span className="text-cyan-700 dark:text-cyan-300 font-semibold">admin123</span>
          </div>
        </div>

      </div>
    </div>
  );
}
