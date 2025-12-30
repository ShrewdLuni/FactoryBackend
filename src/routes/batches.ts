import { createBatchControler, getAllBatchesController, getBatchController, scanBatchController } from "controllers/batches";
import express from "express";

const router = express.Router();

router.get('/', getAllBatchesController)
router.get('/:id', getBatchController)
router.get('/:id/scan', scanBatchController)
router.post('/', createBatchControler)

export default router;
