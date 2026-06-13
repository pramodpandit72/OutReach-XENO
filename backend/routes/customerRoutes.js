import express from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerStats, createCustomersBulk } from '../controllers/customerController.js';

const router = express.Router();

router.get('/stats', getCustomerStats);
router.get('/', getCustomers);
router.post('/bulk', createCustomersBulk);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
