import { Router } from "express";
import { ShiftController } from "./shift.controller";

const router = Router();
const controller = new ShiftController();

router.get("/", controller.findMany);
router.post("/start", controller.start);
router.post("/end", controller.end);
router.get("/current/:workerId", controller.current);
router.get("/:id", controller.find);

export default router;
