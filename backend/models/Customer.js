import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  city: { type: String, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number },
  totalSpend: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  lastPurchaseDate: { type: Date },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Customer', customerSchema);
