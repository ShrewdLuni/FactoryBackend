import express from 'express'
import { createProductController, getProductsController } from 'controllers/products';
import { authenticate } from 'middleware/auth';

const router = express.Router();

router.post('/', authenticate, createProductController);
router.get('/', authenticate, getProductsController)

export default router;
