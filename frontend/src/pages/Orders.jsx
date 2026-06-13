import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OrderTable from '../components/OrderTable';
import { getOrders, getOrderStats } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { ShoppingBag, TrendingUp, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [o, s] = await Promise.all([
          getOrders({ page, limit: 20 }),
          getOrderStats(),
        ]);
        setOrders(o.data.orders);
        setTotal(o.data.total);
        setStats(s.data.stats);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{total.toLocaleString()} total orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: total.toLocaleString(), icon: ShoppingBag, color: '#22d3ee' },
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue), icon: TrendingUp, color: '#4ade80' },
          { label: 'Avg Order Value', value: formatCurrency(stats?.avgOrderValue), icon: Package, color: '#38bdf8' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
            style={{ borderColor: `${color}30` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400">All Orders</h2>
        </div>
        <div className="p-4">
          <OrderTable orders={orders} loading={loading} />
        </div>
        {total > 20 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">Prev</button>
            <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 20)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} className="btn btn-ghost btn-sm">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
