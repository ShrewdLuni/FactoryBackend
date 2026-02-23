import { getBatchesController, getBatchController, scanBatchController, initializePlannedBatchesController, updateBatchController, deleteBatchController, createBatchController, executePlannedBatchesController, createBatchesController, persistSpoilageController } from "controllers/batches";
import express from "express";
import { authenticate } from "middleware/auth";

const router = express.Router();

router.get('/', authenticate, getBatchesController)
router.get('/:id', getBatchController)
router.post('/', authenticate, createBatchController)
router.post('/bulk', authenticate, createBatchesController)
router.put('/:id', authenticate, updateBatchController)
router.delete('/:id', authenticate, deleteBatchController)
router.patch('/:id/scan', authenticate, scanBatchController)
router.post('/planned', authenticate, initializePlannedBatchesController)
router.patch('/planned/execute', authenticate, executePlannedBatchesController)
router.patch('/:id/spoilage', persistSpoilageController)

export default router;
