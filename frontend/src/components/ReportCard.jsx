import { motion } from 'framer-motion';

export default function ReportCard({ label, value, sub, color = '#22d3ee', icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="card text-center"
      style={{ borderColor: `${color}30` }}
    >
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-sm font-medium text-white mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </motion.div>
  );
}
