import express from "express"
import { migrateDatabase, testDatabase } from "controllers/database";
import logger from "logger";
import { AddUsersToDB } from "utils/1C/AddUsersToDB";
import { AddProductsToDB } from "utils/1C/AddProductsToDB";

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)
router.get("/add-users", async (req: express.Request, res: express.Response) => {
  try {
    await AddUsersToDB()
    logger.info("1C users added");
    res.sendStatus(200);
  }
  catch {
    logger.info("1C users fail");
    res.sendStatus(200);
  }
})
router.get("/add-products", async (req: express.Request, res: express.Response) => {
  try {
    await AddProductsToDB()
    logger.info("1C products added");
    res.sendStatus(200);
  }
  catch (error) {
    logger.info("1C products fail");
    res.sendStatus(200);
  }
})

export default router;
