import axios from 'axios';
import { randomOutcome, randomDelay } from '../utils/randomStatus.js';

// Simulates sending a batch of messages and calling back the CRM with results
export const simulateDelivery = async (recipients, callbackUrl) => {
  for (const recipient of recipients) {
    const delay = randomDelay();
    const status = randomOutcome();

    setTimeout(async () => {
      try {
        await axios.post(callbackUrl, {
          commId: recipient.commId,
          status,
          channel: recipient.channel,
          timestamp: new Date().toISOString(),
        });
        console.log(`📬 Callback sent: commId=${recipient.commId} status=${status}`);
      } catch (err) {
        console.error(`❌ Callback failed for commId=${recipient.commId}: ${err.message}`);
      }
    }, delay);
  }
};
