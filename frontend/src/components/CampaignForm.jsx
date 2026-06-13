import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCampaign, aiGenerateMessage } from '../services/api';

export default function CampaignForm({ segments, onCreated, onClose }) {
  const [form, setForm] = useState({ name: '', segmentId: '', channel: 'WhatsApp', messageTemplate: '' });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const selectedSegment = segments?.find(s => s._id === form.segmentId);

  const handleAIMessage = async () => {
    if (!form.segmentId) return toast.error('Select a segment first');
    setAiLoading(true);
    try {
      const { data } = await aiGenerateMessage({
        segmentDescription: selectedSegment?.description || selectedSegment?.name || 'loyal customers',
        channel: form.channel,
        goal: 'Drive purchases and re-engage customers',
      });
      setForm(f => ({ ...f, messageTemplate: data.message }));
      toast.success('AI message generated!');
    } catch {
      toast.error('AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.segmentId || !form.messageTemplate) {
      return toast.error('Fill all required fields');
    }
    setLoading(true);
    try {
      const { data } = await createCampaign(form);
      toast.success('Campaign created!');
      onCreated?.(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: '#111827' }}>
        <h2 className="text-lg font-bold text-white mb-6">Create Campaign</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Campaign Name *</label>
            <input
              className="input"
              placeholder="e.g. Summer Re-engagement"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              id="campaign-name-input"
            />
          </div>

          <div>
            <label className="label">Segment *</label>
            <select
              className="select"
              value={form.segmentId}
              onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}
              id="campaign-segment-select"
            >
              <option value="">Select a segment</option>
              {segments?.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.audienceSize} customers)
                </option>
              ))}
            </select>
            {selectedSegment && (
              <p className="text-xs text-cyan-400 mt-1">
                Audience: {selectedSegment.audienceSize} customers
              </p>
            )}
          </div>

          <div>
            <label className="label">Channel *</label>
            <select
              className="select"
              value={form.channel}
              onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
              id="campaign-channel-select"
            >
              {['WhatsApp', 'SMS', 'Email', 'RCS'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label mb-0">Message Template *</label>
              <button
                type="button"
                onClick={handleAIMessage}
                disabled={aiLoading}
                className="btn btn-sm flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(34,211,238,0.2))', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)', padding: '4px 12px', fontSize: '12px' }}
                id="ai-generate-btn"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Generate
              </button>
            </div>
            <textarea
              className="input"
              placeholder="Hi {{name}}, we have something special for you..."
              value={form.messageTemplate}
              onChange={e => setForm(f => ({ ...f, messageTemplate: e.target.value }))}
              rows={5}
              id="campaign-message-input"
            />
            <p className="text-xs text-gray-600 mt-1">Use {'{{name}}'}, {'{{city}}'}, {'{{totalSpend}}'} for personalization</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1" id="cancel-campaign-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1" id="create-campaign-btn">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
