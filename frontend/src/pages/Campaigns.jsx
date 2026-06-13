import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CampaignCard from '../components/CampaignCard';
import CampaignForm from '../components/CampaignForm';
import { getCampaigns, sendCampaign, getSegments } from '../services/api';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([getCampaigns(), getSegments()]);
      setCampaigns(c.data);
      setSegments(s.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSend = async (id) => {
    if (!confirm('Send this campaign now?')) return;
    setSending(id);
    try {
      const { data } = await sendCampaign(id);
      toast.success(data.message || 'Campaign sending!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Send failed');
    } finally {
      setSending(null);
    }
  };

  const handleCreated = () => {
    setShowForm(false);
    load();
    toast.success('Campaign ready to send!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">{campaigns.length} campaigns total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          id="new-campaign-btn"
        >
          <Plus size={16} /> New Campaign
        </motion.button>
      </div>

      {/* Send pending hint */}
      {campaigns.some(c => c.status === 'Draft') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}
        >
          <Send size={16} style={{ color: '#38bdf8' }} />
          <p className="text-sm text-sky-400">You have draft campaigns ready to send. Click a campaign and hit "Send Campaign".</p>
        </motion.div>
      )}

      {/* Campaigns grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-40 rounded-xl" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--color-text-subtle)' }}>
          <p className="text-4xl mb-3">📣</p>
          <p className="font-medium">No campaigns yet</p>
          <p className="text-sm mt-1">Create your first campaign to reach your customers</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {campaigns.map((c, i) => (
            <div key={c._id} className="relative">
              <CampaignCard campaign={c} delay={i * 0.05} />
              {c.status === 'Draft' && (
                <button
                  onClick={() => handleSend(c._id)}
                  disabled={sending === c._id}
                  className="btn btn-green btn-sm absolute bottom-4 right-4"
                  id={`send-campaign-${c._id}`}
                >
                  {sending === c._id ? <Loader2 size={14} className="animate-spin" /> : <><Send size={13} /> Send</>}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CampaignForm segments={segments} onCreated={handleCreated} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
