import { getAllBatchesController } from "controllers/batches";
import express from "express";

const router = express.Router();

router.get('/', getAllBatchesController)

export default router;
