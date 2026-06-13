import { motion } from 'framer-motion';
import { Users, Trash2, Zap, Target } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

export default function SegmentCard({ segment, onDelete, onSelect, selected }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="card cursor-pointer transition-all group"
      style={selected ? { borderColor: '#22d3ee', boxShadow: '0 0 20px rgba(34,211,238,0.2)' } : {}}
      onClick={() => onSelect && onSelect(segment)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.2)' }}
          >
            <Target size={16} style={{ color: '#22d3ee' }} />
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{segment.name}</p>
            {segment.createdByAI && (
              <span className="badge badge-ai text-xs">
                <Zap size={10} /> AI Generated
              </span>
            )}
          </div>
        </div>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(segment._id); }}
            className="btn-icon btn-danger p-1"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {segment.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{segment.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Users size={14} />
          <span className="text-sm font-semibold">{segment.audienceSize?.toLocaleString() || 0} customers</span>
        </div>
        <span className="text-xs text-gray-600">{formatDate(segment.createdAt)}</span>
      </div>

      {segment.rules?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-1">
          {segment.rules.slice(0, 3).map((r, i) => (
            <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
              {r.field} {r.operator} {r.value}
            </span>
          ))}
          {segment.rules.length > 3 && (
            <span className="text-xs text-gray-600">+{segment.rules.length - 3} more</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
