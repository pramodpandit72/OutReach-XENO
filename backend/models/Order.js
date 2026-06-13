import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  items: [{ name: String, category: String, price: Number, qty: Number }],
  channel: { type: String, enum: ['Online', 'In-Store', 'App'], default: 'Online' },
  status: { type: String, enum: ['Pending', 'Delivered', 'Returned'], default: 'Delivered' },
  orderDate: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
