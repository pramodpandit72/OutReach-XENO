import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerTable({ customers, onDelete, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!customers?.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">👥</p>
        <p className="font-medium">No customers found</p>
        <p className="text-sm mt-1">Add your first customer to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>City</th>
            <th>Orders</th>
            <th>Total Spend</th>
            <th>Last Purchase</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <motion.tr
              key={c._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <td>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #22d3ee22, #4ade8022)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
                  >
                    {c.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.email}</p>
                  </div>
                </div>
              </td>
              <td><span className="text-sm">{c.city || '—'}</span></td>
              <td><span className="text-sm font-medium text-cyan-400">{c.orderCount || 0}</span></td>
              <td><span className="text-sm font-medium text-green-400">{formatCurrency(c.totalSpend)}</span></td>
              <td><span className="text-sm text-gray-400">{formatDate(c.lastPurchaseDate)}</span></td>
              <td>
                <div className="flex items-center gap-1">
                  {onDelete && (
                    <button
                      onClick={() => onDelete(c._id)}
                      className="btn-icon btn-danger p-1"
                      title="Delete customer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
