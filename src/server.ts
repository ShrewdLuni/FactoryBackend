import express from "express";
// import router from "routes";
import router from "router";
import cors from "cors";
import cookieParser from "cookie-parser";
import logging from "middleware/logging";
import logger from "logger";
import { CLIENT_URL } from "config";
import { generateOpenApiDoc } from "./openapi";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [CLIENT_URL], credentials: true }));
app.use(logging);


const openapi = generateOpenApiDoc()

app.get("/openapi.json", (_req, res) => res.json(openapi));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use(router);

app.get("/health", async (_req: express.Request, res: express.Response) => {
  res.status(200);
})

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});
