import { Menu, Sun, Moon, LogOut, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../services/api';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick, user, theme, toggleTheme }) {
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30"
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-icon btn-ghost"
          id="menu-toggle"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <p style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>Welcome back,</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
            {user?.name || 'Marketer'}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="btn-icon btn-ghost tooltip"
          data-tip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          id="theme-toggle"
        >
          {theme === 'dark'
            ? <Sun size={18} style={{ color: '#fbbf24' }} />
            : <Moon size={18} style={{ color: '#6366f1' }} />
          }
        </motion.button>

        {/* User section */}
        {user && (
          <div
            className="flex items-center gap-2 pl-2"
            style={{ borderLeft: '1px solid var(--color-border)' }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #4ade80)', color: '#050d1a' }}
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="hidden md:block">
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.2 }}>
                {user.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', lineHeight: 1.2 }}>
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-icon btn-ghost tooltip"
              data-tip="Logout"
              id="logout-btn"
              style={{ color: 'var(--color-text-subtle)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-subtle)'}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
