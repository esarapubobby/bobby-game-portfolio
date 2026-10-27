import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, HelpCircle, Terminal } from 'lucide-react';
import { BUTTON_INTERACTIONS } from '../../lib/animations';

export const AdminLogin: React.FC = () => {
  const { signIn, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090c0e] flex flex-col justify-center items-center p-4 selection:bg-accent/30 selection:text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Site link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Portfolio</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#111720] border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center mx-auto text-accent mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
              Developer Portal
            </h1>
            <p className="text-xs font-mono text-gray-400">
              Bobby Esarapu Portfolio Administration
            </p>
          </div>

          {/* Connection status notification */}
          {!isSupabaseConfigured && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-600/40 text-[11px] font-mono text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span>Local Sandbox Mode Active: Enter administrator email (</span>
                <strong className="text-white">esarapubobby@gmail.com</strong>
                <span>) and any password to test.</span>
              </div>
            </div>
          )}

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200 flex items-start gap-2 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="esarapubobby@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              {...BUTTON_INTERACTIONS}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-black font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent shadow-lg shadow-accent/10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Portal</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle setup instructions */}
          <div className="pt-2 text-center border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-accent transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showSetupGuide ? 'Hide Supabase setup guide' : 'First time admin setup guide'}</span>
            </button>
          </div>

          <AnimatePresence>
            {showSetupGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-300 space-y-2.5 font-mono overflow-hidden"
              >
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-accent" />
                  How to set up your Supabase Admin:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-gray-400 text-[11px]">
                  <li>Sign up at <span className="text-white">supabase.com</span> and create a project.</li>
                  <li>Go to <span className="text-white">SQL Editor</span> and execute <span className="text-accent">supabase/schema.sql</span>.</li>
                  <li>Go to <span className="text-white">Authentication &gt; Users &gt; Add User</span> with your email.</li>
                  <li>In SQL Editor, authorize your user:
                    <div className="p-2 bg-black rounded mt-1 text-accent break-all text-[10px]">
                      INSERT INTO public.admin_users (id, email) VALUES ('&lt;user_id&gt;', 'esarapubobby@gmail.com');
                    </div>
                  </li>
                  <li>Paste your project URL & Anon key into <span className="text-white">.env</span>.</li>
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
