import mongoose from 'mongoose';

// A rule looks like: { field: 'totalSpend', operator: 'gt', value: 5000 }
const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true }, // gt, lt, gte, lte, eq, ne, contains
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { _id: false });

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  rules: [ruleSchema],
  logic: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  createdByAI: { type: Boolean, default: false },
  audienceSize: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Segment', segmentSchema);
