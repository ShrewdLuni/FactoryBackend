import { Controller } from "abstract/controller";
import { BatchTemplateInsertSchema, type BatchTemplate, type BatchTemplateInsert } from "./batchTemplate.schema";
import { BatchTemplateService } from "./batchTemplate.service";

export class BatchTemplateController extends Controller<BatchTemplate, BatchTemplateInsert, BatchTemplateService> {
  constructor(service: BatchTemplateService = new BatchTemplateService()) {
    super(service, BatchTemplateInsertSchema);
  }
}
