import express from "express";
import { BatchTransitionController } from "./batchTransitions.controller";

const router = express.Router();

const controller = new BatchTransitionController();

router.get("/", controller.findMany);
router.post("/", controller.create);
router.post("/bulk", controller.createMany);
router.post("/bulk/update", controller.updateMany);
router.post("/bulk/patch", controller.patchMany);
router.post("/bulk/delete", controller.deleteMany);
router.get("/:id", controller.find);
router.put("/:id", controller.update);
router.patch("/:id", controller.patch);
router.delete("/:id", controller.delete);

export default router;
