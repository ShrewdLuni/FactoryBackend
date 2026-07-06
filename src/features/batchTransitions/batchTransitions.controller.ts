import { Controller } from "abstract/controller";
import { BatchTransitionInsertSchema, type BatchTransition, type BatchTransitionInsert } from "./batchTransitions.schema";
import { BatchTransitionService } from "./batchTransitions.service";

export class BatchTransitionController extends Controller<BatchTransition, BatchTransitionInsert, BatchTransitionService> {
  constructor(service: BatchTransitionService = new BatchTransitionService()) {
    super(service, BatchTransitionInsertSchema);
  }
}
