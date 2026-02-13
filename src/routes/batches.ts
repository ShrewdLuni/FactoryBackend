import { getBatchesController, getBatchController, scanBatchController, initializePlannedBatchesController, updateBatchController, deleteBatchController, createBatchController, createMultipleBatchesController, executePlannedBatchesController } from "controllers/batches";
import express from "express";
import { authenticate } from "middleware/auth";

const router = express.Router();

router.get('/', authenticate, getBatchesController)
router.get('/:id', getBatchController)
router.post('/', authenticate, createBatchController)
router.post('/bulk', authenticate, createMultipleBatchesController)
router.put('/:id', authenticate, updateBatchController)
router.delete('/:id', authenticate, deleteBatchController)
router.get('/:id/scan', authenticate, scanBatchController)
router.post('/planned', authenticate, initializePlannedBatchesController)
router.post('/planned/execute', authenticate, executePlannedBatchesController)

export default router;
