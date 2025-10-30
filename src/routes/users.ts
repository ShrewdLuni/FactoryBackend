import { getUsersController } from "controllers/users";
import express from "express";

const router = express.Router();

router.get('/', getUsersController)

export default router;
