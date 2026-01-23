import express from 'express'
import { createProductController, getProductsController, updateProductController } from 'controllers/products';
import { authenticate } from 'middleware/auth';

const router = express.Router();

router.post('/', authenticate, createProductController);
router.get('/', authenticate, getProductsController)
router.put('/:id', authenticate, updateProductController)

export default router;
