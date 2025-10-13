import express from "express"
import { router } from "./routes";
import { query } from "db";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

app.use("/api", router)

app.get("/db/test", async (req, res) => {
  const result = await query("SELECT NOW()")
  if(result == undefined || result == null){
    res.status(500).send("PostgreSQL is not working")
  }
  console.log(result);
  res.status(200).send(`PostgreSQL is online, server time is: ${result.rows[0].now}`)
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
})
