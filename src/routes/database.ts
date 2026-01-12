import express from "express"
import { migrateDatabase, testDatabase } from "controllers/database";
import { query } from "db";
import logger from "logger";
import { AddUsersToDB } from "utils/1C/AddUsersToDB";
import { AddProductsToDB } from "utils/1C/AddProductsToDB";

const router = express.Router()

router.get("/test", testDatabase)
router.get("/migrate", migrateDatabase)
router.get("/seed", async (req: express.Request, res: express.Response) => {
  try {
    await query(`INSERT INTO products (code, name, category) VALUES(152, 'Red Socks', 'Socks'), (164, 'Blue Socks', 'Socks'), (82, 'Xmas Socks', 'Socks(Special)')`);
    await query(`INSERT INTO users (username, first_name, last_name, gender, role) VALUES
      ('master_one', 'Ivan', 'Petrov', 'Male', 'Master'),
      ('master_two', 'Olga', 'Sidorova', 'Female', 'Master'),
      ('master_three', 'Dmitry', 'Kuznetsov', 'Male', 'Master'),
      ('master_four', 'Anastasia', 'Volkova', 'Female', 'Master'),
      ('master_five', 'Sergey', 'Novikov', 'Male', 'Master'),
      ('master_six', 'Dmitry', 'Volkov', 'Male', 'Worker'),
      ('master_seven', 'Sergey', 'Brin', 'Male', 'Manager')`)
    logger.info("Seed succeeded");
    res.sendStatus(200);
  } catch(error) {
    logger.error(error);
    res.sendStatus(500);
  }
})
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
