import { Controller } from "abstract/controller";
import { BatchInsertSchema, type Batch, type BatchInsert } from "./batch.schema";
import { BatchService } from "./batch.service";

export class BatchController extends Controller<Batch, BatchInsert, BatchService> {
  constructor(service: BatchService = new BatchService()) {
    super(service, BatchInsertSchema);
  }
}
