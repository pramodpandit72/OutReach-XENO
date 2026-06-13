import Communication from '../models/Communication.js';
import Campaign from '../models/Campaign.js';

// POST /api/receipts – called by channel service with delivery outcome
export const handleReceipt = async (req, res, next) => {
  try {
    const { commId, status } = req.body;
    if (!commId || !status) return res.status(400).json({ error: 'commId and status required' });

    const comm = await Communication.findById(commId);
    if (!comm) return res.status(404).json({ error: 'Communication not found' });

    // Update communication status & add delivery event
    comm.status = status;
    comm.deliveryEvents.push({ status, timestamp: new Date() });
    comm.updatedAt = new Date();
    await comm.save();

    // Update campaign counters atomically
    const update = {};
    if (status === 'Delivered') update.$inc = { deliveredCount: 1 };
    else if (status === 'Failed') update.$inc = { failedCount: 1 };
    else if (status === 'Opened') update.$inc = { openedCount: 1 };
    else if (status === 'Clicked') update.$inc = { clickedCount: 1 };

    if (Object.keys(update).length > 0) {
      await Campaign.findByIdAndUpdate(comm.campaignId, update);
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
