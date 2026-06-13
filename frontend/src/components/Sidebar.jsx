import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingBag, Target, Megaphone,
  Sparkles, X, Radio, Upload,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers',  icon: Users,            label: 'Customers' },
  { to: '/orders',     icon: ShoppingBag,      label: 'Orders' },
  { to: '/ingest',     icon: Upload,           label: 'Ingest Data' },
  { to: '/segments',   icon: Target,           label: 'Segments' },
  { to: '/campaigns',  icon: Megaphone,        label: 'Campaigns' },
  { to: '/ai-studio',  icon: Sparkles,         label: 'AI Studio' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile slide-in panel */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-64 z-50 flex flex-col lg:hidden"
        style={{
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        <SidebarContent onClose={onClose} />
      </motion.aside>

      {/* Desktop always-visible sidebar */}
      <aside
        className="hidden lg:flex flex-col h-full w-64 flex-shrink-0"
        style={{
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}

function SidebarContent({ onClose }) {
  return (
    <>
      {/* Logo */}
      <div
        className="flex items-center justify-between p-5"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #4ade80)' }}
          >
            <Radio size={16} color="#050d1a" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-base font-bold gradient-text">OutReach</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-subtle)', marginTop: 1 }}>AI-Native CRM</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom badge */}
      <div className="p-3">
        <div className="gradient-card rounded-xl p-3 text-center">
          <p style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600 }}>🤖 Gemini AI Powered</p>
          <p style={{ fontSize: 10, color: 'var(--color-text-subtle)', marginTop: 2 }}>Xeno Assignment 2026</p>
        </div>
      </div>
    </>
  );
}
