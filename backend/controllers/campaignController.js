import Campaign from '../models/Campaign.js';
import Communication from '../models/Communication.js';
import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import { buildSegmentQuery } from '../utils/buildSegmentQuery.js';
import { personalizeMessage } from '../utils/personalizeMessage.js';
import axios from 'axios';

// GET /api/campaigns
export const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().populate('segmentId', 'name').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
};

// GET /api/campaigns/:id
export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('segmentId');
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    const communications = await Communication.find({ campaignId: campaign._id })
      .populate('customerId', 'name email phone')
      .sort({ sentAt: -1 })
      .limit(100);
    res.json({ campaign, communications });
  } catch (err) {
    next(err);
  }
};

// POST /api/campaigns
export const createCampaign = async (req, res, next) => {
  try {
    const { name, segmentId, channel, messageTemplate } = req.body;
    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: 'Segment not found' });

    const query = buildSegmentQuery(segment.rules, segment.logic);
    const audienceSize = await Customer.countDocuments(query);

    const campaign = new Campaign({ name, segmentId, channel, messageTemplate, audienceSize });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
};

// POST /api/campaigns/:id/send
export const sendCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('segmentId');
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    if (campaign.status === 'Sending' || campaign.status === 'Sent') {
      return res.status(400).json({ error: 'Campaign already sent or sending' });
    }

    // Get audience
    const segment = campaign.segmentId;
    const query = buildSegmentQuery(segment.rules, segment.logic);
    const customers = await Customer.find(query);

    if (customers.length === 0) {
      return res.status(400).json({ error: 'No customers in this segment' });
    }

    // Update campaign status
    campaign.status = 'Sending';
    campaign.sentAt = new Date();
    campaign.audienceSize = customers.length;
    await campaign.save();

    // Create communication records & call channel service
    const channelServiceUrl = process.env.CHANNEL_SERVICE_URL || 'https://outreach-channel-service.onrender.com';
    const crmBaseUrl = process.env.CRM_BASE_URL || 'https://outreach-xeno.onrender.com';

    const communications = [];
    for (const customer of customers) {
      const personalizedMessage = personalizeMessage(campaign.messageTemplate, customer.toObject());
      const comm = new Communication({
        campaignId: campaign._id,
        customerId: customer._id,
        channel: campaign.channel,
        personalizedMessage,
        status: 'Queued',
        sentAt: new Date(),
      });
      await comm.save();
      communications.push({ commId: comm._id.toString(), customer, personalizedMessage });
    }

    // Fire-and-forget to channel service
    (async () => {
      try {
        await axios.post(`${channelServiceUrl}/channel/send`, {
          campaignId: campaign._id.toString(),
          channel: campaign.channel,
          recipients: communications.map(c => ({
            commId: c.commId,
            customerId: c.customer._id.toString(),
            name: c.customer.name,
            message: c.personalizedMessage,
          })),
          callbackUrl: `${crmBaseUrl}/api/receipts`,
        });
      } catch (e) {
        console.error('Channel service error:', e.message);
      }

      // Update campaign to Sent after dispatching
      await Campaign.findByIdAndUpdate(campaign._id, { status: 'Sent', sentCount: customers.length });
    })();

    res.json({ message: `Campaign sending to ${customers.length} recipients`, campaignId: campaign._id });
  } catch (err) {
    next(err);
  }
};
