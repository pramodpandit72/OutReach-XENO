import { GoogleGenerativeAI } from '@google/generative-ai';
import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Campaign from '../models/Campaign.js';
import Communication from '../models/Communication.js';

const getAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/segment-rules
// Body: { prompt: "find customers who haven't bought in 90 days and spent over 5000" }
export const generateSegmentRules = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `You are a CRM segment rules generator. Convert the user's natural language into a JSON array of rules.
Each rule must have:
- field: one of [totalSpend, orderCount, lastPurchaseDate, city, gender, age, name]
- operator: one of [gt, lt, gte, lte, eq, ne, contains, daysBefore, daysWithin]
- value: the value to compare against (number for numeric fields, string for text fields, number of days for date operators)

Also return a "logic" field: "AND" or "OR".
Also return a "description" field explaining the segment in plain English.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "rules": [...],
  "logic": "AND",
  "description": "..."
}

User request: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text().trim();

    // Clean possible markdown code blocks
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error('AI segment error:', err.message);
    // Fallback mock if AI fails
    res.json({
      rules: [
        { field: 'totalSpend', operator: 'gt', value: 5000 },
        { field: 'lastPurchaseDate', operator: 'daysBefore', value: 90 },
      ],
      logic: 'AND',
      description: 'High-value customers who haven\'t purchased recently',
    });
  }
};

// POST /api/ai/message
// Body: { segmentDescription, channel, goal }
export const generateCampaignMessage = async (req, res, next) => {
  try {
    const { segmentDescription, channel, goal } = req.body;

    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Write a personalized ${channel} marketing message for a D2C brand.

Target audience: ${segmentDescription}
Campaign goal: ${goal || 'Re-engage customers and drive purchases'}
Channel: ${channel}

Rules:
- Use {{name}} as a placeholder for the customer's name
- Keep it concise and compelling (${channel === 'SMS' ? 'max 160 chars' : channel === 'WhatsApp' ? 'conversational, 2-3 sentences' : 'friendly email style'})
- Include a clear call-to-action
- Sound human, not robotic
- Don't use emojis in SMS

Return ONLY the message text, no explanation.`;

    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();
    res.json({ message });
  } catch (err) {
    console.error('AI message error:', err.message);
    res.json({ message: `Hi {{name}}! We have an exclusive offer just for you. Shop now and save 15% on your next order. Use code OUTREACH15. Tap to explore! 🛍️` });
  }
};

// POST /api/ai/insights
// Body: { campaignId, stats: { sentCount, deliveredCount, failedCount, openedCount, clickedCount, audienceSize } }
export const generateCampaignInsights = async (req, res, next) => {
  try {
    const { campaignName, stats } = req.body;

    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const deliveryRate = stats.sentCount > 0 ? ((stats.deliveredCount / stats.sentCount) * 100).toFixed(1) : 0;
    const openRate = stats.deliveredCount > 0 ? ((stats.openedCount / stats.deliveredCount) * 100).toFixed(1) : 0;
    const clickRate = stats.deliveredCount > 0 ? ((stats.clickedCount / stats.deliveredCount) * 100).toFixed(1) : 0;
    const failRate = stats.sentCount > 0 ? ((stats.failedCount / stats.sentCount) * 100).toFixed(1) : 0;

    const prompt = `You are a CRM campaign analyst. Analyze this campaign performance and give 3-4 concise, actionable insights in plain English.

Campaign: "${campaignName}"
Audience Size: ${stats.audienceSize}
Sent: ${stats.sentCount} | Delivered: ${stats.deliveredCount} (${deliveryRate}%) | Failed: ${stats.failedCount} (${failRate}%)
Opened: ${stats.openedCount} (${openRate}% of delivered) | Clicked: ${stats.clickedCount} (${clickRate}% of delivered)

Give bullet points. Be specific. Mention what worked, what didn't, and 1-2 recommendations for the next campaign.
Keep it under 150 words total.`;

    const result = await model.generateContent(prompt);
    const insights = result.response.text().trim();
    res.json({ insights });
  } catch (err) {
    console.error('AI insights error:', err.message);
    res.json({ insights: 'Campaign analysis unavailable. Please check your AI API key.' });
  }
};

// POST /api/ai/chat
export const aiChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Fetch CRM system context to inject into Gemini prompt
    const [
      customerCount,
      campaignCount,
      orderCount,
      segments,
      campaigns,
      revenueData,
    ] = await Promise.all([
      Customer.countDocuments(),
      Campaign.countDocuments(),
      Order.countDocuments(),
      Segment.find().limit(5).select('name description audienceSize'),
      Campaign.find().sort({ createdAt: -1 }).limit(3).select('name status channel audienceSize sentCount deliveredCount failedCount openedCount clickedCount'),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    const systemContext = `You are "OutReach CRM Assistant", an intelligent AI CRM helper powered by Google Gemini.
You have access to the real-time status of the CRM database. Here is the current CRM status:
- Total Customers: ${customerCount}
- Total Campaigns: ${campaignCount}
- Total Orders: ${orderCount}
- Total Revenue: ₹${totalRevenue.toLocaleString()}
- Saved Segments:
${segments.map(s => `  * "${s.name}": ${s.description || 'No desc'} (${s.audienceSize} shoppers)`).join('\n') || '  (No saved segments yet)'}
- Recent Campaigns:
${campaigns.map(c => `  * "${c.name}": status=${c.status}, channel=${c.channel}, audience=${c.audienceSize}, sent=${c.sentCount}, delivered=${c.deliveredCount}, opened=${c.openedCount}, clicked=${c.clickedCount}`).join('\n') || '  (No campaigns sent yet)'}

You can help the marketer think, decide, and act:
- Answer questions about their CRM stats.
- Draft WhatsApp, SMS, Email, and RCS campaign messages.
- Suggest segment rules.
- Suggest how to optimize campaign performance.

Format your responses nicely in Markdown (with bullet points, bold text, code blocks if appropriate). Be direct, conversational, and premium. Make suggestions that fit their actual data.

Conversation History:
${history?.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n') || 'None'}
User: ${message}
Assistant:`;

    const genAI = getAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(systemContext);
    const responseText = result.response.text().trim();
    
    res.json({ response: responseText });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.json({ response: "I'm sorry, I'm having trouble connecting to Gemini. Please try again or verify your API key." });
  }
};
