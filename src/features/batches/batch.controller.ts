import express from "express";
import { Controller } from "abstract/controller";
import { BatchAdvanceRequestSchema, BatchInsertSchema, type Batch, type BatchInsert } from "./batch.schema";
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

  advance = asyncHandler(async (req: express.Request, res: express.Response) => {
    const batchId = Number(req.params.id);
    const { actorId, coworkers, defects, sizeOverride, remainder } = BatchAdvanceRequestSchema.parse(req.body);

    await this.service.advance(
      batchId,
      actorId,
      coworkers,
      defects.map((d) => ({ defect_type_id: d.defectTypeId, quantity: d.quantity })),
      sizeOverride,
      remainder
    );

    res.status(200).json({ success: true });
  });
}
