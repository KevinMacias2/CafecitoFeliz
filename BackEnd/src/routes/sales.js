import express from 'express';
import * as saleController from '../controllers/saleController.js';

const router = express.Router();

router.post('/', saleController.createSale);
router.get('/:id', saleController.getSaleById);

export default router;