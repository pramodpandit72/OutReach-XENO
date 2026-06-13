import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';

export default function OrderTable({ orders, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">🛍️</p>
        <p className="font-medium">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Category</th>
            <th>Channel</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <motion.tr
              key={o._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <td>
                <div>
                  <p className="font-medium text-white text-sm">{o.customerId?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{o.customerId?.email}</p>
                </div>
              </td>
              <td><span className="text-sm">{o.items?.[0]?.category || '—'}</span></td>
              <td>
                <span className={`badge badge-${o.channel?.toLowerCase() === 'online' ? 'delivered' : 'sent'}`}>
                  {o.channel}
                </span>
              </td>
              <td><span className="font-medium text-green-400 text-sm">{formatCurrency(o.amount)}</span></td>
              <td><span className="text-sm text-gray-400">{formatDate(o.orderDate)}</span></td>
              <td>
                <span className={`badge ${o.status === 'Delivered' ? 'badge-delivered' : o.status === 'Returned' ? 'badge-failed' : 'badge-queued'}`}>
                  {o.status}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
