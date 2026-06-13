import 'dotenv/config';
import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

const MONGO_URI = process.env.MONGO_URI;

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
const genders = ['Male', 'Female'];
const categories = ['Fashion', 'Electronics', 'Beauty', 'Home Decor', 'Sports', 'Books', 'Food'];
const channels = ['Online', 'In-Store', 'App'];

const firstNames = ['Aarav', 'Priya', 'Rohit', 'Sneha', 'Vikram', 'Anita', 'Karan', 'Pooja', 'Amit', 'Neha',
  'Rahul', 'Divya', 'Sanjay', 'Meera', 'Arjun', 'Kavya', 'Nikhil', 'Shreya', 'Kunal', 'Riya',
  'Aditya', 'Swati', 'Varun', 'Nisha', 'Gaurav', 'Pallavi', 'Manish', 'Sunita', 'Deepak', 'Anjali',
  'Sachin', 'Archana', 'Tushar', 'Geeta', 'Harish', 'Lata', 'Yash', 'Rekha', 'Vivek', 'Radha'];
const lastNames = ['Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Verma', 'Mehta', 'Joshi', 'Agarwal', 'Mishra',
  'Rao', 'Reddy', 'Nair', 'Pillai', 'Bose', 'Chatterjee', 'Mukherjee', 'Das', 'Shah', 'Jain'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - randInt(0, daysAgo));
  return d;
};

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create 50 customers
    const customers = [];
    for (let i = 0; i < 50; i++) {
      const name = `${rand(firstNames)} ${rand(lastNames)}`;
      const email = `${name.toLowerCase().replace(' ', '.')}.${randInt(1, 999)}@example.com`;
      customers.push({
        name,
        email,
        phone: `+91${randInt(7000000000, 9999999999)}`,
        city: rand(cities),
        gender: rand(genders),
        age: randInt(18, 55),
        totalSpend: 0,
        orderCount: 0,
      });
    }
    const savedCustomers = await Customer.insertMany(customers);
    console.log(`✅ Created ${savedCustomers.length} customers`);

    // Create 2-6 orders per customer
    const orders = [];
    for (const customer of savedCustomers) {
      const numOrders = randInt(1, 6);
      let totalSpend = 0;
      let lastPurchaseDate = null;

      for (let i = 0; i < numOrders; i++) {
        const orderDate = randDate(365);
        const amount = randInt(500, 15000);
        totalSpend += amount;
        if (!lastPurchaseDate || orderDate > lastPurchaseDate) lastPurchaseDate = orderDate;

        orders.push({
          customerId: customer._id,
          amount,
          items: [{ name: `${rand(categories)} Item`, category: rand(categories), price: amount, qty: 1 }],
          channel: rand(channels),
          status: 'Delivered',
          orderDate,
        });
      }

      // Update customer stats
      await Customer.findByIdAndUpdate(customer._id, {
        totalSpend,
        orderCount: numOrders,
        lastPurchaseDate,
      });
    }

    await Order.insertMany(orders);
    console.log(`✅ Created ${orders.length} orders`);
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
