import express from 'express';
import { getOrders, createOrder, getOrderStats, createOrdersBulk } from '../controllers/orderController.js';

const router = express.Router();

router.get('/stats', getOrderStats);
router.get('/', getOrders);
router.post('/bulk', createOrdersBulk);
router.post('/', createOrder);

export default router;
