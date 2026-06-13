import express from 'express';
import { getDashboardStats, getRevenueTrend, getRecentCallbacks } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/revenue-trend', getRevenueTrend);
router.get('/recent-callbacks', getRecentCallbacks);

export default router;
