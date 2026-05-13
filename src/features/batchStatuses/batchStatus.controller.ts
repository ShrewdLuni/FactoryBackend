import { Controller } from "abstract/controller";
import { BatchStatusInsertSchema, type BatchStatus, type BatchStatusInsert } from "./batchStatus.schema";
import { BatchStatusService } from "./batchStatus.service";

export class BatchStatusController extends Controller<BatchStatus, BatchStatusInsert, BatchStatusService> {
  constructor(service: BatchStatusService = new BatchStatusService()) {
    super(service, BatchStatusInsertSchema);
  }
}
