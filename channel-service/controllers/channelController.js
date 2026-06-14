import { simulateDelivery } from '../services/simulatorService.js';

// POST /channel/send
export const handleSend = async (req, res) => {
  try {
    const { campaignId, channel, recipients, callbackUrl } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients provided' });
    }

    const crmCallback = callbackUrl || process.env.CRM_RECEIPT_URL || 'http://localhost:8000/api/receipts';
    console.log(`📨 Channel service received ${recipients.length} messages for campaign ${campaignId} via ${channel}`);

    // Start async simulation – do NOT await, return 200 immediately
    simulateDelivery(recipients, crmCallback);

    res.json({
      accepted: recipients.length,
      message: `Simulating ${channel} delivery for ${recipients.length} recipients. Callbacks will arrive shortly.`,
    });
  } catch (err) {
    console.error('Channel send error:', err.message);
    res.status(500).json({ error: 'Channel service error' });
  }
};
