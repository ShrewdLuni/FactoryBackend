import express from "express"
import { createWorkstationController, deleteWorkstationController, getAllWorkstationsController, getWorkstationController, updateWorkstationController } from "controllers/workstations";

const router = express.Router()

router.get("/", getAllWorkstationsController)
router.get("/:id", getWorkstationController)
router.post("/", createWorkstationController)
router.put("/:id", updateWorkstationController)
router.delete("/:id", deleteWorkstationController)

export default router;
