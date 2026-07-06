import { migrateDatabase, testDatabase } from "controllers/database"; import express from "express"

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)

export default router;
