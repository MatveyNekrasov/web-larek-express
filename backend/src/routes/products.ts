import { Router } from 'express';

import { celebrate } from 'celebrate';
import { createProduct, getProducts } from '../controllers/products';
import productValidator from '../validators/product-validator';

const router = Router();
router.get('/', getProducts);
router.post('/', celebrate(productValidator), createProduct);

export default router;
