import express from 'express'
import { createProductController, deleteProductController, getProductsController, updateProductController } from 'controllers/products';
import { authenticate } from 'middleware/auth';

const router = express.Router();

router.post('/', authenticate, getProductsController);
router.get('/:id', authenticate, getProductsController)
router.post('/', authenticate, createProductController)
router.put('/:id', authenticate, updateProductController)
router.delete('/:id', authenticate, deleteProductController)


export default router;
