import Campaign from '../models/Campaign.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Communication from '../models/Communication.js';

// GET /api/analytics/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalCampaigns,
      totalOrders,
      revenueData,
      recentCampaigns,
    ] = await Promise.all([
      Customer.countDocuments(),
      Campaign.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Campaign.find().sort({ createdAt: -1 }).limit(5).populate('segmentId', 'name'),
    ]);

    const totalDelivered = await Communication.countDocuments({ status: 'Delivered' });
    const totalSent = await Communication.countDocuments({ status: { $ne: 'Queued' } });
    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0;

    const totalClicked = await Communication.countDocuments({ status: 'Clicked' });
    const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0;

    res.json({
      totalCustomers,
      totalCampaigns,
      totalOrders,
      totalRevenue: revenueData[0]?.total || 0,
      deliveryRate: Number(deliveryRate),
      clickRate: Number(clickRate),
      recentCampaigns,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/revenue-trend
export const getRevenueTrend = async (req, res, next) => {
  try {
    const trend = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: '$orderDate' }, month: { $month: '$orderDate' } },
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);
    res.json(trend);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/recent-callbacks
export const getRecentCallbacks = async (req, res, next) => {
  try {
    const list = await Communication.find()
      .sort({ updatedAt: -1 })
      .limit(30)
      .populate('customerId', 'name')
      .populate('campaignId', 'name');
    res.json(list);
  } catch (err) {
    next(err);
  }
};
