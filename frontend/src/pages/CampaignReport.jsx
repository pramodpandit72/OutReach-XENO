import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReportCard from '../components/ReportCard';
import Loader from '../components/Loader';
import { getCampaignById, aiInsights } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';

const STATUS_COLORS = {
  Delivered: '#4ade80', Failed: '#f87171', Opened: '#fbbf24',
  Clicked: '#a78bfa', Sent: '#38bdf8', Queued: '#9ca3af',
};

export default function CampaignReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  const load = async () => {
    try {
      const { data: res } = await getCampaignById(id);
      setData(res);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  // Auto-refresh for live updates when campaign is sending
  useEffect(() => {
    if (data?.campaign?.status === 'Sent') {
      const interval = setInterval(load, 5000);
      return () => clearInterval(interval);
    }
  }, [data?.campaign?.status]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const { data: res } = await aiInsights({
        campaignName: data.campaign.name,
        stats: {
          audienceSize: data.campaign.audienceSize,
          sentCount: data.campaign.sentCount,
          deliveredCount: data.campaign.deliveredCount,
          failedCount: data.campaign.failedCount,
          openedCount: data.campaign.openedCount,
          clickedCount: data.campaign.clickedCount,
        },
      });
      setInsights(res.insights);
    } catch {
      toast.error('AI insights failed');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader size="lg" text="Loading report..." /></div>;
  }

  if (!data) return <p className="text-gray-500">Campaign not found</p>;

  const { campaign, communications } = data;
  const deliveryRate = campaign.sentCount > 0 ? ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1) : 0;
  const openRate = campaign.deliveredCount > 0 ? ((campaign.openedCount / campaign.deliveredCount) * 100).toFixed(1) : 0;
  const clickRate = campaign.deliveredCount > 0 ? ((campaign.clickedCount / campaign.deliveredCount) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/campaigns')} className="btn-icon btn-ghost p-2" id="back-to-campaigns">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`badge badge-${campaign.status?.toLowerCase()}`}>{campaign.status}</span>
            <span className="text-xs text-gray-500">{campaign.channel} · {campaign.segmentId?.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ReportCard label="Audience" value={campaign.audienceSize} icon="👥" color="#38bdf8" delay={0} />
        <ReportCard label="Sent" value={campaign.sentCount} icon="📤" color="#22d3ee" delay={0.1} />
        <ReportCard label="Delivered" value={campaign.deliveredCount} sub={`${deliveryRate}% rate`} icon="✅" color="#4ade80" delay={0.2} />
        <ReportCard label="Failed" value={campaign.failedCount} icon="❌" color="#f87171" delay={0.3} />
        <ReportCard label="Opened" value={campaign.openedCount} sub={`${openRate}% of delivered`} icon="👀" color="#fbbf24" delay={0.4} />
        <ReportCard label="Clicked" value={campaign.clickedCount} sub={`${clickRate}% of delivered`} icon="🖱️" color="#a78bfa" delay={0.5} />
        <ReportCard label="Revenue" value={formatCurrency(campaign.revenueAttributed)} icon="💰" color="#4ade80" delay={0.6} />
        <ReportCard label="Sent At" value={formatDateTime(campaign.sentAt) === '—' ? 'Pending' : '✓'} icon="🕐" color="#6b7280" delay={0.7} />
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card"
        style={{ borderColor: 'rgba(167,139,250,0.2)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: '#a78bfa' }} />
            <h2 className="text-base font-semibold">AI Performance Insights</h2>
          </div>
          <button
            onClick={fetchInsights}
            disabled={loadingInsights}
            className="btn btn-sm"
            style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)' }}
            id="generate-insights-btn"
          >
            {loadingInsights ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {insights ? 'Regenerate' : 'Generate Insights'}
          </button>
        </div>
        {insights ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
          >
            {insights}
          </motion.div>
        ) : (
          <p className="text-sm text-gray-600">Click "Generate Insights" to get AI-powered analysis of this campaign's performance.</p>
        )}
      </motion.div>

      {/* Communications log */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card p-0 overflow-hidden"
      >
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-base font-semibold">Communication Log</h2>
          <span className="text-xs text-gray-500">{communications.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Status</th>
                <th>Message Preview</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {communications.map((c, i) => (
                <motion.tr
                  key={c._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <td>
                    <div>
                      <p className="font-medium text-sm">{c.customerId?.name}</p>
                      <p className="text-xs text-gray-500">{c.customerId?.email}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span>
                  </td>
                  <td>
                    <p className="text-xs text-gray-400 max-w-xs truncate">{c.personalizedMessage}</p>
                  </td>
                  <td>
                    <span className="text-xs text-gray-500">{formatDateTime(c.updatedAt)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {communications.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <p>No communication records yet. Send the campaign first.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
