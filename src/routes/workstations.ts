import express from "express"
import { createWorkstationController, deleteWorkstationController, getAllWorkstationsController, getWorkstationController, updateWorkstationController } from "controllers/workstations";
import { authenticate } from "middleware/auth";

const router = express.Router()

router.get("/", authenticate, getAllWorkstationsController)
router.get("/:id", getWorkstationController)
router.post("/", authenticate, createWorkstationController)
router.put("/:id", authenticate, updateWorkstationController)
router.delete("/:id", authenticate, deleteWorkstationController)

export default router;
