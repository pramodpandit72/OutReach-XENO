import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Megaphone, ShoppingBag, TrendingUp, Activity, Target, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatsCard from '../components/StatsCard';
import CampaignCard from '../components/CampaignCard';
import Loader from '../components/Loader';
import { getDashboardStats, getRevenueTrend, getRecentCallbacks } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([getDashboardStats(), getRevenueTrend()]);
        setStats(s.data);
        setTrend(t.data.map(d => ({
          month: MONTHS[d._id.month - 1],
          revenue: d.revenue,
          orders: d.orders,
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadRecentLogs = async () => {
    try {
      const { data } = await getRecentCallbacks();
      if (data && data.length > 0) {
        const formatted = data.map(c => {
          const updatedDate = new Date(c.updatedAt);
          const time = updatedDate.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const statusCls = `log-${c.status?.toLowerCase()}`;
          return {
            id: c._id,
            time,
            msg: `Campaign "${c.campaignId?.name || 'Campaign'}": ${c.channel} to ${c.customerId?.name || 'Customer'}`,
            status: c.status,
            cls: statusCls,
          };
        });
        setLogs(formatted);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error('Failed to load recent callbacks', e);
    }
  };

  useEffect(() => {
    loadRecentLogs();
    const interval = setInterval(loadRecentLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your CRM performance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Customers" value={stats?.totalCustomers?.toLocaleString() || 0} icon={Users} color="cyan" delay={0} />
        <StatsCard title="Total Campaigns" value={stats?.totalCampaigns || 0} icon={Megaphone} color="green" delay={0.1} />
        <StatsCard title="Delivery Rate" value={`${stats?.deliveryRate || 0}%`} icon={Activity} color="sky" delay={0.2} />
        <StatsCard title="Click Rate" value={`${stats?.clickRate || 0}%`} icon={TrendingUp} color="purple" delay={0.3} />
      </div>

      {/* Second row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <StatsCard title="Total Orders" value={stats?.totalOrders?.toLocaleString() || 0} icon={ShoppingBag} color="green" delay={0.1} />
        <StatsCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue)} icon={TrendingUp} color="cyan" delay={0.2} />
        <StatsCard title="Active Segments" value={stats?.totalSegments || '—'} icon={Target} color="sky" delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Revenue Chart — spans 3 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card lg:col-span-3"
        >
          <h2 className="section-title mb-4">Revenue Trend</h2>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-subtle)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-subtle)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 10,
                    color: 'var(--color-text)',
                    fontSize: 13,
                  }}
                  formatter={v => [formatCurrency(v), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center" style={{ color: 'var(--color-text-subtle)' }}>
              <p>No revenue data yet. Seed the database to see trends.</p>
            </div>
          )}
        </motion.div>

        {/* Live Callback Log Feed — spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h2 className="section-title">Live Callbacks</h2>
          </div>
          <div className="log-feed" ref={logRef}>
            {logs.length === 0 ? (
              <p style={{ color: 'var(--color-text-subtle)', textAlign: 'center', padding: 16 }}>
                Waiting for delivery events…
              </p>
            ) : (
              logs.map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="log-line"
                >
                  <span className="log-time">{log.time}</span>
                  <span className={log.cls} style={{ fontWeight: 600, minWidth: 72 }}>{log.status}</span>
                  <span className="log-msg">{log.msg}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Campaigns */}
      {stats?.recentCampaigns?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2 className="section-title mb-4">Recent Campaigns</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.recentCampaigns.map((c, i) => (
              <CampaignCard key={c._id} campaign={c} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
