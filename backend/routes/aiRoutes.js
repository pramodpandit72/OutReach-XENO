import express from 'express';
import { generateSegmentRules, generateCampaignMessage, generateCampaignInsights, aiChat } from '../controllers/aiController.js';

const router = express.Router();

router.post('/segment-rules', generateSegmentRules);
router.post('/message', generateCampaignMessage);
router.post('/insights', generateCampaignInsights);
router.post('/chat', aiChat);

export default router;
