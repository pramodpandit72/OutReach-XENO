import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Sparkles, Users, BarChart3, Target, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const features = [
  { icon: Users, label: 'Smart Segmentation', desc: 'AI-powered audience targeting' },
  { icon: Target, label: 'Campaign Engine', desc: 'Multi-channel personalized campaigns' },
  { icon: BarChart3, label: 'Live Analytics', desc: 'Real-time delivery & engagement insights' },
  { icon: Sparkles, label: 'Gemini AI', desc: 'AI segment rules & message generation' },
];

export default function LoginPage({ onLogin, initialTab = 'login', theme = 'dark' }) {
  const [tab, setTab] = useState(initialTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'signup') {
        if (!form.name.trim()) return toast.error('Name is required');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
        toast.success(`Welcome, ${data.user.name}! 🎉`);
        onLogin?.(data.user);
      } else {
        const { data } = await loginUser({ email: form.email, password: form.password });
        toast.success(`Welcome back, ${data.user.name}!`);
        onLogin?.(data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Stagger wrapper for left feature list
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--color-bg)', transition: 'background 0.25s' }}
    >
      {/* Clipped background container for breathing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 15, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] dark:opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] dark:opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)' }}
        />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left – Brand Column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              <Radio size={24} style={{ color: 'var(--color-bg)' }} strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">OutReach</h1>
              <p className="text-xs text-slate-500 dark:text-gray-500 font-medium">AI-Native Mini CRM</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
            Reach your shoppers<br />
            <span className="gradient-text">intelligently</span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed text-sm sm:text-base">
            Segment your customers with AI, send personalized campaigns across channels,
            and track real-time performance — all in one place.
          </p>

          {/* Staggered features list */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3.5"
          >
            {features.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  boxShadow: '0 8px 30px rgba(34,211,238,0.08)',
                  borderColor: 'rgba(34,211,238,0.3)'
                }}
                className="gradient-card rounded-xl p-3.5 border border-slate-200/50 dark:border-cyan-500/10 hover:border-cyan-500/35 transition-colors duration-200"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-2.5"
                  style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.2)' }}
                >
                  <Icon size={14} className="text-cyan-500 dark:text-cyan-400" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 leading-normal">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right – Auth Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glass rounded-2xl p-8 border border-slate-200/50 dark:border-white/10 relative overflow-hidden shadow-2xl hover:shadow-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 opacity-80" />

            {/* Logo icon bubble */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(74,222,128,0.08))',
                border: '1px solid rgba(34,211,238,0.25)'
              }}
            >
              <Radio size={26} className="text-cyan-500 dark:text-cyan-400" />
            </motion.div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-1">Welcome to OutReach</h3>
            <p className="text-slate-500 dark:text-gray-500 text-sm text-center mb-6">Sign in to your account to continue</p>

            {/* ── Tab switcher with sliding animation ── */}
            <div className="flex p-1 rounded-xl mb-6 relative border border-slate-200 dark:border-slate-800" style={{ background: 'var(--color-surface-2)' }}>
              {['login', 'signup'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg relative z-10 transition-colors duration-300"
                  style={{
                    color: tab === t
                      ? (theme === 'dark' ? '#0a0f1e' : '#ffffff')
                      : 'var(--color-text-muted)'
                  }}
                  id={`tab-${t}`}
                >
                  {t === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
              <motion.div
                layoutId="auth-active-tab"
                className="absolute top-1 bottom-1 rounded-lg"
                style={{
                  left: tab === 'login' ? '4px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 6px)',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            </div>

            {/* ── Email/Password Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {tab === 'signup' && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="label text-slate-700 dark:text-gray-400 font-semibold">Full Name</label>
                    <input
                      className="input focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required={tab === 'signup'}
                      id="signup-name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="label text-slate-700 dark:text-gray-400 font-semibold">Email</label>
                <input
                  className="input focus:ring-2 focus:ring-cyan-400/20"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  id="auth-email"
                />
              </div>

              <div>
                <label className="label text-slate-700 dark:text-gray-400 font-semibold">Password</label>
                <div className="relative">
                  <input
                    className="input pr-10 focus:ring-2 focus:ring-cyan-400/20"
                    type={showPass ? 'text' : 'password'}
                    placeholder={tab === 'signup' ? 'At least 6 characters' : 'Your password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    id="auth-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full shadow-lg"
                id="auth-submit-btn"
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin" />
                  : tab === 'login' ? 'Log In' : 'Create Account'
                }
              </motion.button>
            </form>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200 dark:bg-gray-800" />
              <span className="text-xs text-slate-400 dark:text-gray-600 font-semibold">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-gray-800" />
            </div>

            {/* ── Google OAuth ── */}
            <a
              href={`${API_URL}/auth/google`}
              id="google-login-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '11px 20px',
                borderRadius: '8px',
                background: 'white',
                color: '#1a1a1a',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>

            {/* Demo hint */}
            <div className="mt-5 p-3 rounded-xl text-center border border-cyan-500/10 bg-cyan-500/5 dark:bg-cyan-500/10">
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                <Sparkles size={11} className="inline mr-1" />
                50+ seeded customers, AI-powered segments & campaigns ready to explore
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
