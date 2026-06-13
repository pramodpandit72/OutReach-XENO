import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomerTable from '../components/CustomerTable';
import { getCustomers, createCustomer, deleteCustomer } from '../services/api';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', gender: 'Male', age: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getCustomers({ search, city, page, limit: 15 });
      setCustomers(data.customers);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, city, page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCustomer({ ...form, age: Number(form.age) });
      toast.success('Customer added!');
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', city: '', gender: 'Male', age: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{total.toLocaleString()} total customers</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          id="add-customer-btn"
        >
          <Plus size={16} /> Add Customer
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input pl-9"
            placeholder="Search by name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            id="customer-search"
          />
        </div>
        <select
          className="select w-40"
          value={city}
          onChange={e => { setCity(e.target.value); setPage(1); }}
          id="city-filter"
        >
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>All Customers</h2>
        </div>
        <div className="p-4">
          <CustomerTable customers={customers} onDelete={handleDelete} loading={loading} />
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="flex items-center justify-center gap-2 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-ghost btn-sm"
            >Prev</button>
            <span style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>Page {page} of {Math.ceil(total / 15)}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 15)}
              className="btn btn-ghost btn-sm"
            >Next</button>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="modal-box max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>Add Customer</h2>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--color-text-subtle)' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Name *</label>
                    <input className="input" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required id="new-customer-name" />
                  </div>
                  <div>
                    <label className="label">Age</label>
                    <input className="input" type="number" placeholder="Age" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} id="new-customer-age" />
                  </div>
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input className="input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required id="new-customer-email" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" placeholder="+91..." value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} id="new-customer-phone" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <select className="select" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} id="new-customer-city">
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select className="select" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} id="new-customer-gender">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn btn-primary flex-1" id="save-customer-btn">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Customer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
