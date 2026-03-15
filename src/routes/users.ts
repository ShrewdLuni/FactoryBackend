import { UserController } from "controllers_new/users";
import express from "express";
import { authenticate } from "middleware/auth";
import { UserRepository } from "repositories/users";
import { UserService } from "services_new/users";

const router = express.Router();

const controller = new UserController(new UserService(new UserRepository()));

router.get("/", controller.findMany);
router.get("/:id", controller.find);
router.put("/:id", authenticate, controller.update);

export default router;
