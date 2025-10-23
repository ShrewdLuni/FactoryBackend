import express from "express"
import { query } from "db";
import { migrate } from "migration";
import { migrateDatabase, testDatabase } from "controllers/database";

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)

export default router;
