import express from "express"
import { migrateDatabase, testDatabase } from "controllers/database";
import { query } from "db";
import logger from "logger";

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)
router.get("/seed", async (req: express.Request, res: express.Response) => {
  try {
    await query(`INSERT INTO products (code, name, category) VALUES(152, 'Red Socks', 'Socks'), (164, 'Blue Socks', 'Socks'), (82, 'Xmas Socks', 'Socks(Special)')`);
    logger.info("Seed succeeded");
    res.sendStatus(200);
  } catch(error) {
    logger.error(error);
    res.sendStatus(500);
  }
})

export default router;
