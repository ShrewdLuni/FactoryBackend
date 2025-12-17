import { createBatchControler, getAllBatchesController } from "controllers/batches";
import express from "express";

const router = express.Router();

router.get('/', getAllBatchesController)
router.post('/', createBatchControler)

export default router;
