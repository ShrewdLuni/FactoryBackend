import logger from "logger";
import express from "express"

const logging = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
}

export default logging
