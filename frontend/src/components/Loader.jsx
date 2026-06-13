import { motion } from 'framer-motion';

export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const s = sizes[size] || 36;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#22d3ee',
          borderRightColor: '#4ade80',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}
