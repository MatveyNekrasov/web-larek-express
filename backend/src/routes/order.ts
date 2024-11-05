import { Router } from 'express';
import { celebrate } from 'celebrate';

import createOrder from '../controllers/order';
import orderValidator from '../validators/order-validator';

const router = Router();
router.post('/', celebrate(orderValidator), createOrder);

export default router;
