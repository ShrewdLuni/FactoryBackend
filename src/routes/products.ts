import express from 'express'
import { createProductController, getProductsController } from 'controllers/products';
import { authenticate } from 'middleware/auth';

const router = express.Router();

router.post('/', authenticate, createProductController);
router.get('/', getProductsController)

export default router;
