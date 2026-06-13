import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Eye, Trash2, Loader2, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import SegmentCard from '../components/SegmentCard';
import { getSegments, createSegment, deleteSegment, previewSegment, aiSegmentRules } from '../services/api';

const FIELDS = [
  { value: 'totalSpend', label: 'Total Spend (₹)' },
  { value: 'orderCount', label: 'Order Count' },
  { value: 'age', label: 'Age' },
  { value: 'lastPurchaseDate', label: 'Last Purchase' },
  { value: 'city', label: 'City' },
  { value: 'gender', label: 'Gender' },
];

const OPERATORS = {
  totalSpend: [{ v: 'gt', l: '>' }, { v: 'lt', l: '<' }, { v: 'gte', l: '>=' }, { v: 'lte', l: '<=' }],
  orderCount: [{ v: 'gt', l: '>' }, { v: 'lt', l: '<' }, { v: 'gte', l: '>=' }],
  age: [{ v: 'gt', l: '>' }, { v: 'lt', l: '<' }, { v: 'gte', l: '>=' }, { v: 'lte', l: '<=' }],
  lastPurchaseDate: [{ v: 'daysBefore', l: 'more than X days ago' }, { v: 'daysWithin', l: 'within last X days' }],
  city: [{ v: 'eq', l: 'is' }, { v: 'ne', l: 'is not' }],
  gender: [{ v: 'eq', l: 'is' }],
};

const emptyRule = () => ({ field: 'totalSpend', operator: 'gt', value: '' });

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', rules: [emptyRule()], logic: 'AND' });
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getSegments();
      setSegments(data);
    } catch {
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this segment?')) return;
    try {
      await deleteSegment(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const { data } = await previewSegment({ rules: form.rules, logic: form.logic });
      setPreview(data);
    } catch {
      toast.error('Preview failed');
    } finally {
      setPreviewing(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) return toast.error('Enter a segment name');
    setSaving(true);
    try {
      await createSegment({ ...form, audienceSize: preview?.count });
      toast.success('Segment created!');
      setShowForm(false);
      setForm({ name: '', description: '', rules: [emptyRule()], logic: 'AND' });
      setPreview(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAI = async () => {
    if (!aiPrompt) return toast.error('Enter a description');
    setAiLoading(true);
    try {
      const { data } = await aiSegmentRules(aiPrompt);
      setForm(f => ({
        ...f,
        rules: data.rules,
        logic: data.logic || 'AND',
        description: data.description || '',
        name: f.name || aiPrompt.slice(0, 40),
      }));
      toast.success('AI rules generated!');
      setShowAI(false);
    } catch {
      toast.error('AI failed, try again');
    } finally {
      setAiLoading(false);
    }
  };

  const updateRule = (i, key, val) => {
    setForm(f => {
      const rules = [...f.rules];
      rules[i] = { ...rules[i], [key]: val };
      if (key === 'field') rules[i].operator = OPERATORS[val]?.[0]?.v || 'eq';
      return { ...f, rules };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Segments</h1>
          <p className="page-subtitle">Create audience groups with rules or AI</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          id="create-segment-btn"
        >
          <Plus size={16} /> Create Segment
        </motion.button>
      </div>

      {/* Segments Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-40 rounded-xl" />)}
        </div>
      ) : segments.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-medium">No segments yet</p>
          <p className="text-sm mt-1">Create your first segment to target customers</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map(s => (
            <SegmentCard key={s._id} segment={s} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Segment Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="modal-box max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>Create Segment</h2>
                <button onClick={() => setShowForm(false)}><X size={18} style={{ color: 'var(--color-text-subtle)' }} /></button>
              </div>

              {/* AI Helper */}
              <div className="mb-5 rounded-xl p-4" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                <button
                  onClick={() => setShowAI(!showAI)}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <Sparkles size={16} style={{ color: '#a78bfa' }} />
                  <span className="text-sm font-medium text-purple-300">Generate rules with AI</span>
                  {showAI ? <ChevronUp size={14} className="ml-auto text-gray-500" /> : <ChevronDown size={14} className="ml-auto text-gray-500" />}
                </button>
                <AnimatePresence>
                  {showAI && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 flex gap-2">
                        <input
                          className="input flex-1 text-sm"
                          placeholder={`e.g. "customers who spent more than 5000 and haven't bought in 90 days"`}
                          value={aiPrompt}
                          onChange={e => setAiPrompt(e.target.value)}
                          id="ai-prompt-input"
                        />
                        <button onClick={handleAI} disabled={aiLoading} className="btn btn-sm" style={{ background: 'rgba(167,139,250,0.3)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.3)', whiteSpace: 'nowrap' }} id="ai-generate-rules-btn">
                          {aiLoading ? <Loader2 size={14} className="animate-spin" /> : 'Generate'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Name & Description */}
              <div className="space-y-4 mb-5">
                <div>
                  <label className="label">Segment Name *</label>
                  <input className="input" placeholder="e.g. High-Value Inactive" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} id="segment-name-input" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <input className="input" placeholder="Describe this segment" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} id="segment-desc-input" />
                </div>
              </div>

              {/* Rules */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Rules</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Match</span>
                    <select className="select w-20 text-xs py-1" value={form.logic} onChange={e => setForm(f => ({ ...f, logic: e.target.value }))} id="segment-logic-select">
                      <option value="AND">ALL</option>
                      <option value="OR">ANY</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  {form.rules.map((rule, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select className="select flex-1 text-xs" value={rule.field} onChange={e => updateRule(i, 'field', e.target.value)}>
                        {FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                      <select className="select w-40 text-xs" value={rule.operator} onChange={e => updateRule(i, 'operator', e.target.value)}>
                        {(OPERATORS[rule.field] || [{ v: 'eq', l: 'is' }]).map(op => (
                          <option key={op.v} value={op.v}>{op.l}</option>
                        ))}
                      </select>
                      <input className="input w-28 text-xs" placeholder="Value" value={rule.value} onChange={e => updateRule(i, 'value', e.target.value)} />
                      {form.rules.length > 1 && (
                        <button onClick={() => setForm(f => ({ ...f, rules: f.rules.filter((_, ri) => ri !== i) }))} className="text-gray-600 hover:text-red-400 flex-shrink-0">
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, rules: [...f.rules, emptyRule()] }))}
                  className="mt-2 text-xs text-cyan-500 hover:text-cyan-300 flex items-center gap-1"
                  id="add-rule-btn"
                >
                  <Plus size={13} /> Add Rule
                </button>
              </div>

              {/* Preview */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-5 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-semibold text-cyan-400">
                      ✓ {preview.count} customers match this segment
                    </p>
                    {preview.sample?.length > 0 && (
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                        Matched Sample Preview
                      </span>
                    )}
                  </div>
                  {preview.sample?.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] max-h-48">
                      <table className="table min-w-full text-xs">
                        <thead>
                          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                            <th className="px-3 py-2 text-left font-bold text-gray-400">Name</th>
                            <th className="px-3 py-2 text-left font-bold text-gray-400">Email</th>
                            <th className="px-3 py-2 text-right font-bold text-gray-400">Total Spend</th>
                            <th className="px-3 py-2 text-right font-bold text-gray-400">Orders</th>
                            <th className="px-3 py-2 text-left font-bold text-gray-400">City</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.sample.map((c) => (
                            <tr key={c._id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-2)]">
                              <td className="px-3 py-2 text-left font-medium text-[var(--color-text)]">{c.name}</td>
                              <td className="px-3 py-2 text-left text-gray-500">{c.email}</td>
                              <td className="px-3 py-2 text-right font-semibold text-cyan-400">₹{c.totalSpend?.toLocaleString() || 0}</td>
                              <td className="px-3 py-2 text-right text-gray-500">{c.orderCount || 0}</td>
                              <td className="px-3 py-2 text-left text-gray-500">{c.city || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 mt-1 italic text-center py-2">
                      No matching customers found for these rules.
                    </p>
                  )}
                </motion.div>
              )}

              <div className="flex gap-2">
                <button onClick={handlePreview} disabled={previewing} className="btn btn-ghost flex-1" id="preview-segment-btn">
                  {previewing ? <Loader2 size={14} className="animate-spin" /> : <><Eye size={14} /> Preview</>}
                </button>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1" id="save-segment-btn">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save Segment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
