import express from "express";
import { Controller } from "abstract/controller";
import { BatchTransitionInsertSchema, type BatchTransition, type BatchTransitionInsert } from "./batchTransitions.schema";
import { BatchTransitionService } from "./batchTransitions.service";
import { asyncHandler } from "utils/errorHandler";

export class BatchTransitionController extends Controller<BatchTransition, BatchTransitionInsert, BatchTransitionService> {
  constructor(service: BatchTransitionService = new BatchTransitionService()) {
    super(service, BatchTransitionInsertSchema);
  }

  findBatchLogs = asyncHandler(async (_req: express.Request, res: express.Response) => {
    const result = await this.service.findBatchLogs();
    res.status(200).json(result);
  });
}
