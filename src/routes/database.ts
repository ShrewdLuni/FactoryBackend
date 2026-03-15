import logger from "logger";
import express from "express"
import { migrateDatabase, testDatabase } from "controllers/database";
import { asyncHandler } from "utils/errorHandler";
import { seed } from "utils/queries/seed";

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)

export default router;
