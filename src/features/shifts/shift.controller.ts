import { asyncHandler } from "utils/errorHandler";
import type express from "express";
import { z } from "zod";
import { Controller } from "abstract/controller";
import { ShiftService } from "./shift.service";
import { ShiftInsertSchema, ShiftStartSchema, ShiftEndSchema, type Shift, type ShiftInsert } from "./shift.schema";

const workerParamsSchema = z.object({ workerId: z.coerce.number().int().positive() });

export class ShiftController extends Controller<Shift, ShiftInsert, ShiftService> {
  constructor(service: ShiftService = new ShiftService()) {
    super(service, ShiftInsertSchema);
  }

  start = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { worker, device } = ShiftStartSchema.parse(req.body);
    const result = await this.service.startShift(worker.id, device.id);
    res.status(201).json(result);
  });

  end = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { worker, device } = ShiftEndSchema.parse(req.body);
    const result = await this.service.endShift(worker.id, device?.id);
    res.status(200).json(result);
  });

  current = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { workerId } = workerParamsSchema.parse(req.params);
    const result = await this.service.getCurrentShift(workerId);
    if (!result) {
      res.status(404).json({ message: `Worker ${workerId} has no active shift` });
      return;
    }
    res.status(200).json(result);
  });
}
