import logger from "logger";
import express from "express"
import { migrateDatabase, testDatabase } from "controllers/database";
import { AddProductsToDB } from "utils/1C/AddProductsToDB";
import { RegisterExternalUsers } from "utils/1C/RegisterUsers";
import { createAllWorkstations } from "utils/1C/AddWorkstations";

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)
router.get("/add-users", async (req: express.Request, res: express.Response) => {
  try {
    await RegisterExternalUsers()
    logger.info("1C users added/registred");
    res.sendStatus(200);
  }
  catch (error){
    logger.error(error)
    logger.info("1C users fail");
    res.sendStatus(500);
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
    res.sendStatus(500);
  }
})
router.get("/add-workstations", async (req: express.Request, res: express.Response) => {
  try {
    await createAllWorkstations()
    logger.info("workstations added");
    res.sendStatus(200);
  }
  catch (error) {
    logger.info("workstations failed");
    res.sendStatus(500);
  }

})

export default router;
