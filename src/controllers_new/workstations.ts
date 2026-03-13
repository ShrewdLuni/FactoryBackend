import { paramsSchema } from "schemas/utils";
import type { WorkstationService } from "services_new/workstations";
import { asyncHandler } from "utils/errorHandler";
import type express from "express";

export class WorkstationController {

  constructor (private workstationService: WorkstationService) {}

  find = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { id } = paramsSchema.parse(req.params);
    const result = await this.workstationService.find(id);
    res.status(200).json(result);
  });

  findMany = asyncHandler(async (req: express.Request, res: express.Response) => {
    const result = await this.workstationService.findMany();
    res.status(200).json(result);
  });
}
