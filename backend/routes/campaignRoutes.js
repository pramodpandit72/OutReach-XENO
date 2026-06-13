import express from 'express';
import { getCampaigns, getCampaignById, createCampaign, sendCampaign } from '../controllers/campaignController.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);
router.post('/:id/send', sendCampaign);

export default router;
