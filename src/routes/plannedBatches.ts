import { createPlannedBatchController, executePlannedBatchesController, getPlannedBatchController, getPlannedBatchesController, initializePlannedBatchesController, updatePlannedBatchController } from "controllers/plannedBatches"
import express from "express"

const router = express.Router()

router.get('/', getPlannedBatchesController)
router.get('/:id', getPlannedBatchController)
router.post('/', createPlannedBatchController)
router.put('/:id', updatePlannedBatchController)

export default router;
