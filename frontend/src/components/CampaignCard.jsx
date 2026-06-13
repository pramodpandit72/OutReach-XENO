import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const statusConfig = {
  Draft: 'badge-draft',
  Sending: 'badge-sending',
  Sent: 'badge-sent',
  Failed: 'badge-failed',
};

const channelIcon = { WhatsApp: '💬', SMS: '📱', Email: '✉️', RCS: '📡' };

export default function CampaignCard({ campaign, delay = 0 }) {
  const navigate = useNavigate();
  const deliveryRate = campaign.sentCount > 0
    ? Math.round((campaign.deliveredCount / campaign.sentCount) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className="card cursor-pointer group"
      onClick={() => navigate(`/campaigns/${campaign._id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.15)' }}
          >
            {channelIcon[campaign.channel] || '📣'}
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{campaign.name}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
              {campaign.channel} · {campaign.segmentId?.name || 'Segment'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${statusConfig[campaign.status] || 'badge-draft'}`}>{campaign.status}</span>
          <ChevronRight size={16} style={{ color: 'var(--color-text-subtle)' }} className="group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginBottom: 2 }}>Audience</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{campaign.audienceSize?.toLocaleString() || 0}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginBottom: 2 }}>Delivered</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#4ade80' }}>{campaign.deliveredCount?.toLocaleString() || 0}</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginBottom: 2 }}>Del. Rate</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#22d3ee' }}>{deliveryRate}%</p>
        </div>
      </div>

      {/* Progress */}
      {campaign.sentCount > 0 && (
        <div className="mt-3">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              style={{ background: 'linear-gradient(90deg, #22d3ee, #4ade80)' }}
              initial={{ width: 0 }}
              animate={{ width: `${deliveryRate}%` }}
              transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginTop: 12 }}>{formatDate(campaign.createdAt)}</p>
    </motion.div>
  );
}
