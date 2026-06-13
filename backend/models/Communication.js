import mongoose from 'mongoose';

const deliveryEventSchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const communicationSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  channel: { type: String, enum: ['WhatsApp', 'SMS', 'Email', 'RCS'] },
  personalizedMessage: { type: String },
  status: {
    type: String,
    enum: ['Queued', 'Sent', 'Delivered', 'Failed', 'Opened', 'Clicked'],
    default: 'Queued',
  },
  deliveryEvents: [deliveryEventSchema],
  sentAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Communication', communicationSchema);
