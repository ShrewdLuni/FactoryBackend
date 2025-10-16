import express from "express";
import router from "routes";
import { query } from "db";
import cors from "cors";
import cookieParser from "cookie-parser";
import { migrate } from "migration";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use("/api", router);

app.get("/db/test", async (req, res) => {
  const result = await query("SELECT NOW()");
  if (result == undefined || result == null) {
    res.status(500).send("PostgreSQL is not working");
  }
  res
    .status(200)
    .send(`PostgreSQL is online, server time is: ${result.rows[0].now}`);
});

app.get("/db/migrate", async (req, res) => {
  var result = await migrate();
  if (result == undefined || result == null || result == false) {
    res.status(500).send("Migration failed");
  }
  res.status(200).send("Migration succeed");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
