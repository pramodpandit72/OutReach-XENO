import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Sparkles,
  Users,
  BarChart3,
  Target,
  ArrowRight,
  Sun,
  Moon,
  Zap,
  Check,
  Shield,
  Clock,
  Menu,
  X,
  MessageSquare,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function LandingPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rules'); // rules | copy

  // Features data
  const features = [
    {
      icon: Users,
      title: 'Smart Segmentation',
      desc: 'Build highly specific customer groups in real-time. Target based on order values, frequency, city, and custom properties.'
    },
    {
      icon: Target,
      title: 'Campaign Orchestrator',
      desc: 'Launch multi-channel personalized campaigns across Email and SMS with immediate, reliable delivery mechanisms.'
    },
    {
      icon: BarChart3,
      title: 'Live Tracking Feed',
      desc: 'Watch delivery receipts, opens, and click events stream back to your dashboard in real-time via advanced webhooks.'
    },
    {
      icon: Sparkles,
      title: 'Gemini AI Assistant',
      desc: 'Co-author campaign copy and define complex customer rules by typing standard English instructions.'
    }
  ];

  // Steps data
  const steps = [
    {
      step: '01',
      title: 'Ingest Customer Data',
      desc: 'Seamlessly upload customer details and transaction histories. Zero-friction database setup to get you operational instantly.'
    },
    {
      step: '02',
      title: 'Create AI Segments',
      desc: 'Describe who you want to reach in normal language (e.g. "shoppers from Mumbai who spent over ₹5000") and let Gemini do the math.'
    },
    {
      step: '03',
      title: 'Draft with AI Copywriter',
      desc: 'Generate highly engaging, context-aware messages for SMS or Email in a single click, tailormade for the segment.'
    },
    {
      step: '04',
      title: 'Track Conversions Live',
      desc: 'Fire campaign dispatches and observe customer response logs populate live. Optimize messaging based on performance data.'
    }
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 12 } }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Clipped background orbs wrapper to prevent footer spacing bug */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07] dark:opacity-[0.06] blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
        />
        <div
          className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)' }}
        />
        <div
          className="absolute bottom-[-5%] left-[10%] w-[700px] h-[700px] rounded-full opacity-[0.05] dark:opacity-[0.04] blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-sky), transparent)' }}
        />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass w-full transition-all border-b border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group relative z-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
            >
              <Radio size={18} style={{ color: 'var(--color-bg)' }} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">OutReach</span>
              <p className="text-[9px] text-slate-500 dark:text-gray-500 font-medium tracking-wider uppercase -mt-0.5">AI-Native CRM</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {['features', 'how-it-works', 'ai-engine', 'stats'].map(link => (
              <a
                key={link}
                href={`#${link}`}
                className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors relative group py-1"
              >
                {link.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleTheme}
              className="btn-icon btn-ghost p-2 text-slate-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-indigo-600" />
              )}
            </motion.button>

            <button onClick={() => navigate('/login')} className="btn btn-ghost btn-sm font-semibold px-4 py-2 hover:bg-slate-200/50 dark:hover:bg-white/5">
              Log In
            </button>
            <button onClick={() => navigate('/signup')} className="btn btn-primary btn-sm font-semibold px-4 py-2 shadow-lg hover:brightness-105 active:scale-95 transition-all">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="btn-icon btn-ghost p-1.5"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon btn-ghost p-1.5"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-b border-slate-200 dark:border-gray-800 absolute top-16 left-0 right-0 z-40 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {['features', 'how-it-works', 'ai-engine', 'stats'].map(link => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                >
                  {link.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </a>
              ))}
              <div className="h-px bg-slate-200 dark:bg-gray-800 my-2" />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="btn btn-ghost w-full py-2.5 hover:bg-slate-200/50 dark:hover:bg-white/5"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                  className="btn btn-primary w-full py-2.5"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/5 dark:bg-cyan-950/20 text-cyan-500 dark:text-cyan-400 text-xs font-semibold tracking-wide mb-6 animate-pulse-glow"
        >
          <Sparkles size={13} className="text-cyan-500 dark:text-cyan-400" />
          <span>Google Gemini 2.0 Flash Integration Live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.15] mb-6"
        >
          Reach your shoppers <br />
          <span className="gradient-text">intelligently</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-slate-600 dark:text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-8"
        >
          Segment your e-commerce audience with AI, build campaign copies in clicks, and orchestrate high-impact delivery pipelines with real-time logs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-16"
        >
          <button
            onClick={() => navigate('/signup')}
            className="btn btn-primary w-full sm:w-auto px-8 py-3.5 text-base font-semibold group flex items-center justify-center gap-2 shadow-lg"
          >
            Get Started Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setDemoModalOpen(true)}
            className="btn btn-ghost w-full sm:w-auto px-8 py-3.5 text-base font-semibold border-slate-200 hover:bg-slate-200/40 dark:border-gray-800 dark:hover:bg-white/5"
          >
            Watch Demo
          </button>
        </motion.div>

        {/* Dashboard Preview / Mockup UI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl rounded-2xl glass p-3 border border-slate-200/50 dark:border-white/10 glow-cyan relative"
        >
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-gray-900 shadow-2xl">
            {/* Header bar */}
            <div className="h-10 bg-slate-900 border-b border-gray-800/80 flex items-center justify-between px-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-medium text-gray-500 font-mono">outreach-crm-production.com/dashboard</span>
              <div className="w-10" />
            </div>

            {/* Content mockup */}
            <div className="p-4 sm:p-6 text-left grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0a0f1e]">
              {/* Left sidebar simulator */}
              <div className="hidden md:flex flex-col gap-2.5 border-r border-gray-800/60 pr-4">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <BarChart3 size={15} />
                  <span className="text-xs font-semibold">Dashboard</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg text-gray-500">
                  <Users size={15} />
                  <span className="text-xs font-medium">Customers</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg text-gray-500">
                  <Target size={15} />
                  <span className="text-xs font-medium">Segments</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg text-gray-500">
                  <Sparkles size={15} />
                  <span className="text-xs font-medium">AI Studio</span>
                </div>
                <div className="mt-8 p-3 rounded-xl bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/10 text-[10px] text-gray-400">
                  <span className="text-cyan-400 font-bold block mb-1">Gemini Pro</span> Ready for copy generation
                </div>
              </div>

              {/* CRM mockup content */}
              <div className="md:col-span-3 space-y-4">
                {/* Simulated Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Shoppers</p>
                    <p className="text-lg font-bold text-white mt-1">2,482</p>
                    <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                      <TrendingUp size={10} /> +12.4%
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Dispatched</p>
                    <p className="text-lg font-bold text-white mt-1">18,900</p>
                    <span className="text-[9px] text-cyan-400 font-semibold flex items-center gap-0.5 mt-0.5">
                      <Zap size={10} /> 99.8% Deliv.
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-gray-800">
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Total Sales</p>
                    <p className="text-lg font-bold text-cyan-400 mt-1">₹4.82 Lakhs</p>
                    <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                      <TrendingUp size={10} /> +22.8%
                    </span>
                  </div>
                </div>

                {/* Simulated Chart */}
                <div className="p-4 bg-slate-900/40 rounded-xl border border-gray-800/80">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-white">Revenue Growth</span>
                    <span className="text-[10px] text-cyan-400 font-medium px-2 py-0.5 bg-cyan-500/10 rounded">Live Feedback</span>
                  </div>
                  <div className="h-28 flex items-end gap-1.5 pt-2">
                    <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <path
                        d="M0,80 Q30,50 60,65 T120,40 T180,60 T240,25 T300,35 T360,10 T400,20 L400,100 L0,100 Z"
                        fill="url(#grad)"
                        stroke="#22d3ee"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Simulated Callback Feed */}
                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-gray-300">Live Delivery Feed</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] font-mono">
                    <div className="flex justify-between p-1 border-b border-gray-800/30">
                      <span className="text-gray-500">20:45:02</span>
                      <span className="text-emerald-400 font-semibold uppercase">Delivered</span>
                      <span className="text-gray-400">Campaign "Retention Push": SMS to Rohit Sen</span>
                    </div>
                    <div className="flex justify-between p-1 border-b border-gray-800/30">
                      <span className="text-gray-500">20:44:59</span>
                      <span className="text-purple-400 font-semibold uppercase">Clicked</span>
                      <span className="text-gray-400">Campaign "Summer Launch": Email to Priya Das</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 border-t border-slate-200/50 dark:border-gray-800/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-xs font-bold tracking-wider text-cyan-500 dark:text-cyan-400 uppercase mb-2"
          >
            Platform Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Everything your brand needs to scale
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-gray-400 text-base"
          >
            Equipped with rule builders, API webhooks, and Google Gemini artificial intelligence to supercharge customer communication.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="card rounded-2xl flex flex-col p-6 hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 glow-cyan"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}
                >
                  <Icon size={18} className="text-cyan-500 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed flex-1">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How It Works - Visual Timeline */}
      <section id="how-it-works" className="py-20 border-t border-slate-200/50 dark:border-gray-800/60 bg-gradient-to-b from-transparent to-slate-100/30 dark:to-slate-950/20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-xs font-bold tracking-wider text-cyan-500 dark:text-cyan-400 uppercase mb-2"
            >
              Step-by-step Guide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
            >
              Designed for simplicity & performance
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 dark:text-gray-400 text-base"
            >
              A streamlined flow from initial database setup to AI segment rules, copy writing, and real-time execution statistics.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-4 gap-8 relative"
          >
            {steps.map((st) => (
              <motion.div
                key={st.step}
                variants={fadeInUp}
                className="relative flex flex-col bg-slate-100/40 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-gray-800/50 hover:border-cyan-500/20 hover:bg-slate-200/20 dark:hover:bg-slate-900/50 transition-all duration-300 group"
              >
                <span className="text-4xl font-black text-slate-300 dark:text-slate-800 group-hover:text-cyan-400/20 dark:group-hover:text-cyan-950 transition-colors block mb-4">
                  {st.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Features Interactive Highlight */}
      <section id="ai-engine" className="py-20 border-t border-slate-200/50 dark:border-gray-800/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/5 dark:bg-purple-950/10 text-purple-600 dark:text-purple-400 text-xs font-semibold"
            >
              <Cpu size={12} />
              <span>Gemini 2.0 Flash Engine</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
            >
              Harness AI to connect with buyers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed"
            >
              OutReach incorporates AI directly into the marketer's workspace. Create segment rules effortlessly and formulate personalized messages in seconds without leaving the CRM.
            </motion.p>

            {/* Toggle tabs for interactive preview */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 max-w-xs border border-slate-300 dark:border-gray-800 relative"
            >
              {['rules', 'copy'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg relative z-10 transition-all duration-300 ${activeTab === tab ? 'text-slate-950 dark:text-slate-950 font-bold' : 'text-slate-600 dark:text-gray-400'}`}
                >
                  {tab === 'rules' ? 'AI Segment Builder' : 'AI Copywriter'}
                </button>
              ))}
              <motion.div
                layoutId="landing-active-tab"
                className="absolute top-1 bottom-1 rounded-lg"
                style={{
                  left: activeTab === 'rules' ? '4px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 6px)',
                  background: 'var(--color-primary)',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80 }}
            className="lg:col-span-7 bg-slate-950 rounded-2xl border border-gray-900 p-4 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-2 text-purple-400 opacity-10 pointer-events-none">
              <Sparkles size={80} />
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'rules' ? (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-left"
                >
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-[11px] font-bold tracking-wide text-cyan-400 uppercase font-mono">Gemini Rule Engine</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Human Command</p>
                      <div className="p-3 bg-slate-900 rounded-lg text-xs font-medium text-white border border-gray-800">
                        "Find customers from Mumbai who spent at least ₹8000 and haven't ordered in 60 days"
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Generated Database Rule (JSON)</p>
                      <pre className="p-3.5 bg-slate-950 rounded-lg text-[11px] text-emerald-400 font-mono overflow-x-auto border border-emerald-950/30">
{`{
  "$and": [
    { "city": "Mumbai" },
    { "totalSpends": { "$gte": 8000 } },
    { "lastOrderDate": { "$lte": "2026-04-11T00:00:00.000Z" } }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-left"
                >
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="text-[11px] font-bold tracking-wide text-purple-400 uppercase font-mono">AI Copywriting Generator</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Copy Parameters</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-gray-800">
                          <span className="text-gray-500 block text-[9px] font-bold">CHANNEL</span>
                          <span className="text-white font-medium">SMS</span>
                        </div>
                        <div className="p-2.5 bg-slate-900 rounded-lg border border-gray-800">
                          <span className="text-gray-500 block text-[9px] font-bold">SEGMENT</span>
                          <span className="text-white font-medium">VIP Spenders</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Generated Output</p>
                      <div className="p-3 bg-slate-950 rounded-lg text-xs border border-gray-800 font-sans space-y-2">
                        <p className="text-white leading-relaxed">
                          "Hey <span className="text-cyan-400 font-mono font-bold">[Name]</span>! We love your style. As a thank you for being a VIP shopper, here is a custom <span className="text-emerald-400 font-bold">15% discount</span> just for you. Use code <span className="text-purple-400 font-bold font-mono">VIP15</span> at checkout today: outreach.co/vip-sale"
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Numerical Performance / Metrics */}
      <section id="stats" className="py-20 border-t border-slate-200/50 dark:border-gray-800/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-wider text-cyan-500 dark:text-cyan-400 uppercase mb-2"
          >
            Metrics that matter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4"
          >
            Proven to boost marketing ROI
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-gray-400 text-sm sm:text-base"
          >
            Marketers transitioning to AI-native campaigns see immediate jumps in key engagement stats.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: '99.8%', label: 'SMS Delivery Rate', colorClass: 'text-cyan-500' },
            { value: '34%', label: 'Avg. Conversion Bump', colorClass: 'text-emerald-500' },
            { value: '10x', label: 'Faster Audience Building', colorClass: 'text-purple-500' },
            { value: '50M+', label: 'Messages Dispatched', colorClass: 'text-slate-900 dark:text-white' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              variants={fadeInUp}
              className="p-6 bg-slate-100/50 dark:bg-slate-900/20 rounded-2xl border border-slate-200 dark:border-gray-800 hover:scale-[1.03] transition-transform duration-300"
            >
              <span className={`text-4xl sm:text-5xl font-black block mb-2 ${item.colorClass}`}>{item.value}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wide">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t border-slate-200/50 dark:border-gray-800/60 bg-slate-100/50 dark:bg-gradient-to-r dark:from-cyan-950/10 dark:via-purple-950/5 dark:to-emerald-950/10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Ready to scale your shopper communications?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
          >
            Create your account today and explore seeded customers, AI features, and simulator channels instantly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="pt-4 flex justify-center gap-4"
          >
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-primary px-8 py-3.5 text-base font-semibold shadow-lg hover:brightness-105 active:scale-95 transition-all"
            >
              Get Started for Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-gray-900 bg-slate-100/80 dark:bg-slate-950/80 py-12 text-sm text-slate-600 dark:text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}
              >
                <Radio size={14} style={{ color: 'var(--color-bg)' }} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">OutReach</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 max-w-xs leading-relaxed">
              An AI-Native mini CRM platform built for modern, fast-growing direct-to-consumer commerce brands.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Segmentation</a></li>
              <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Campaign Engine</a></li>
              <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Analytics Feed</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Documentation</span></li>
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">API Reference</span></li>
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Changelog</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">About Us</span></li>
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Careers</span></li>
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 dark:border-gray-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>&copy; 2026 OutReach CRM. All rights reserved. Built for D2C scaling.</span>
          <div className="flex gap-4">
            <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Terms of Service</span>
            <span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Security</span>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="modal-bg animate-fade-up" onClick={() => setDemoModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-3xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio size={18} className="text-cyan-500 animate-pulse" />
                  OutReach Platform Walkthrough
                </h3>
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="btn-icon btn-ghost p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mock Video Player */}
              <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden flex flex-col justify-center items-center text-center p-6 border border-slate-800 relative group cursor-pointer">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_70%)]" />
                <div className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center transition-all group-hover:scale-110 relative z-10 shadow-lg shadow-cyan-500/20">
                  <Zap size={28} fill="currentColor" stroke="none" className="ml-1" />
                </div>
                <h4 className="text-white font-bold text-base mt-4 relative z-10">OutReach Platform Tour</h4>
                <p className="text-gray-400 text-xs mt-1.5 max-w-sm relative z-10">
                  Click to start the interactive demo highlighting customer creation, database ingestion, AI rule conversion, and live callbacks.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
