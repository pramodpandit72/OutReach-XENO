import express from 'express';
import { handleReceipt } from '../controllers/receiptController.js';

const router = express.Router();

router.post('/', handleReceipt);

export default router;
