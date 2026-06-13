import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
  channel: { type: String, enum: ['WhatsApp', 'SMS', 'Email', 'RCS'], required: true },
  messageTemplate: { type: String, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Sending', 'Sent', 'Failed'],
    default: 'Draft',
  },
  audienceSize: { type: Number, default: 0 },
  sentCount: { type: Number, default: 0 },
  deliveredCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  openedCount: { type: Number, default: 0 },
  clickedCount: { type: Number, default: 0 },
  revenueAttributed: { type: Number, default: 0 },
  aiInsights: { type: String },
  createdAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
});

export default mongoose.model('Campaign', campaignSchema);
