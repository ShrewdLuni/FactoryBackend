import express from "express"
import { query } from "db";
import { migrate } from "migration";

const router = express.Router()

router.get("/test", async (req, res) => {
  const result = await query("SELECT NOW()");
  if (result == undefined || result == null) {
    res.status(500).send("PostgreSQL is not working");
  }
  res.status(200).send(`PostgreSQL is online, server time is: ${result.rows[0].now}`);
});

router.get("/migrate", async (req, res) => {
  var result = await migrate();
  if (result == undefined || result == null || result == false) {
    res.status(500).send("Migration failed");
  }
  res.status(200).send("Migration succeed");
});

export default router;
