import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, trend, trendLabel, color = 'cyan', delay = 0 }) {
  const colors = {
    cyan:   { bg: 'rgba(34,211,238,0.08)',  border: 'rgba(34,211,238,0.2)',  icon: '#22d3ee', glow: 'rgba(34,211,238,0.12)' },
    green:  { bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)',  icon: '#4ade80', glow: 'rgba(74,222,128,0.12)' },
    sky:    { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)',  icon: '#38bdf8', glow: 'rgba(56,189,248,0.12)' },
    purple: { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', icon: '#a78bfa', glow: 'rgba(167,139,250,0.12)' },
  };
  const c = colors[color] || colors.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="card"
      style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 4px 20px ${c.glow}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            {title}
          </p>
          <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            {value}
          </p>
          {trendLabel && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp size={13} className="text-green-400" />
              ) : (
                <TrendingDown size={13} className="text-red-400" />
              )}
              <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.border }}
        >
          <Icon size={20} style={{ color: c.icon }} />
        </div>
      </div>
    </motion.div>
  );
}
