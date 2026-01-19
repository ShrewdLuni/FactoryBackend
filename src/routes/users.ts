import { getUsersController, updateUserController } from "controllers/users";
import express from "express";

const router = express.Router();

router.get('/', getUsersController)
router.put('/:id', updateUserController)

export default router;
