import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';

// GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const { customerId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (customerId) filter.customerId = customerId;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('customerId', 'name email city').sort({ orderDate: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Update customer stats
    const stats = await Order.aggregate([
      { $match: { customerId: order.customerId } },
      { $group: { _id: '$customerId', totalSpend: { $sum: '$amount' }, orderCount: { $sum: 1 }, lastPurchaseDate: { $max: '$orderDate' } } },
    ]);
    if (stats.length > 0) {
      await Customer.findByIdAndUpdate(order.customerId, {
        totalSpend: stats[0].totalSpend,
        orderCount: stats[0].orderCount,
        lastPurchaseDate: stats[0].lastPurchaseDate,
      });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/stats
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$amount' }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: '$amount' } } },
    ]);
    const recentOrders = await Order.find().populate('customerId', 'name').sort({ orderDate: -1 }).limit(5);
    res.json({ stats: stats[0] || {}, recentOrders });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders/bulk
export const createOrdersBulk = async (req, res, next) => {
  try {
    const { orders } = req.body;
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'orders array is required' });
    }

    // Get all unique emails in the batch
    const emails = [...new Set(orders.map(o => o.customerEmail?.toLowerCase().trim()).filter(Boolean))];
    const customers = await Customer.find({ email: { $in: emails } });
    const customerMap = new Map(customers.map(c => [c.email.toLowerCase(), c]));

    const toInsert = [];
    let skipped = 0;
    for (const o of orders) {
      const email = o.customerEmail?.toLowerCase().trim();
      const customer = customerMap.get(email);
      if (!customer) {
        skipped++;
        continue;
      }
      toInsert.push({
        customerId: customer._id,
        amount: Number(o.amount) || 0,
        channel: o.channel || 'Online',
        status: o.status || 'Delivered',
        orderDate: o.orderDate ? new Date(o.orderDate) : new Date(),
        items: o.items || [],
      });
    }

    let inserted = [];
    if (toInsert.length > 0) {
      inserted = await Order.insertMany(toInsert);

      // Recalculate customer statistics for all affected customers
      const affectedCustomerIds = [...new Set(inserted.map(i => i.customerId.toString()))];
      for (const cid of affectedCustomerIds) {
        const stats = await Order.aggregate([
          { $match: { customerId: new mongoose.Types.ObjectId(cid) } },
          { $group: { _id: '$customerId', totalSpend: { $sum: '$amount' }, orderCount: { $sum: 1 }, lastPurchaseDate: { $max: '$orderDate' } } },
        ]);
        if (stats.length > 0) {
          await Customer.findByIdAndUpdate(cid, {
            totalSpend: stats[0].totalSpend,
            orderCount: stats[0].orderCount,
            lastPurchaseDate: stats[0].lastPurchaseDate,
          });
        }
      }
    }

    res.json({
      message: `Imported ${inserted.length} orders successfully. Skipped ${skipped} orders with unrecognized customer emails.`,
      count: inserted.length,
      skipped,
    });
  } catch (err) {
    next(err);
  }
};
