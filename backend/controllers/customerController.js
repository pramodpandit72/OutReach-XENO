import Customer from '../models/Customer.js';

// GET /api/customers
export const getCustomers = async (req, res, next) => {
  try {
    const { search, city, gender, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (city) filter.city = city;
    if (gender) filter.gender = gender;

    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);

    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// POST /api/customers
export const createCustomer = async (req, res, next) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/customers/stats
export const getCustomerStats = async (req, res, next) => {
  try {
    const total = await Customer.countDocuments();
    const cities = await Customer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json({ total, cities });
  } catch (err) {
    next(err);
  }
};

// POST /api/customers/bulk
export const createCustomersBulk = async (req, res, next) => {
  try {
    const { customers } = req.body;
    if (!customers || !Array.isArray(customers)) {
      return res.status(400).json({ error: 'customers array is required' });
    }

    const emails = customers.map(c => c.email?.toLowerCase().trim()).filter(Boolean);
    const existingCustomers = await Customer.find({ email: { $in: emails } });
    const existingEmails = new Set(existingCustomers.map(c => c.email.toLowerCase()));

    const toInsert = [];
    let skipped = 0;
    for (const c of customers) {
      const email = c.email?.toLowerCase().trim();
      if (!email || existingEmails.has(email)) {
        skipped++;
        continue;
      }
      toInsert.push({
        name: c.name?.trim(),
        email,
        phone: c.phone?.trim() || '',
        city: c.city?.trim() || '',
        gender: c.gender || 'Other',
        age: c.age ? Number(c.age) : undefined,
        totalSpend: c.totalSpend ? Number(c.totalSpend) : 0,
        orderCount: c.orderCount ? Number(c.orderCount) : 0,
        lastPurchaseDate: c.lastPurchaseDate ? new Date(c.lastPurchaseDate) : undefined,
      });
      existingEmails.add(email);
    }

    let inserted = [];
    if (toInsert.length > 0) {
      inserted = await Customer.insertMany(toInsert);
    }

    res.json({
      message: `Imported ${inserted.length} customers successfully. Skipped ${skipped} duplicate/invalid entries.`,
      count: inserted.length,
      skipped,
    });
  } catch (err) {
    next(err);
  }
};
