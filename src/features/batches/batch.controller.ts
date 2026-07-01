import express from "express";
import { Controller } from "abstract/controller";
import { BatchInsertSchema, type Batch, type BatchInsert } from "./batch.schema";
import { BatchService } from "./batch.service";
import { asyncHandler } from "utils/errorHandler";

export class BatchController extends Controller<Batch, BatchInsert, BatchService> {
  constructor(service: BatchService = new BatchService()) {
    super(service, BatchInsertSchema);
  }

  findManyWithAll = asyncHandler(async (_req: express.Request, res: express.Response) => {
    const result = await this.service.findManyWithAll();
    res.status(200).json(result);
  });
}
