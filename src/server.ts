import express from "express";
import router from "routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import logging from "middleware/logging";
import logger from "logger";
import { CLIENT_URL } from "config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [CLIENT_URL], credentials: true }));
app.use(logging);

app.use(router);

app.get("/health", async (req: express.Request, res: express.Response) => {
  res.status(200);
})

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});
