import express from 'express';
import { handleSend } from '../controllers/channelController.js';

const router = express.Router();

router.post('/send', handleSend);

export default router;
