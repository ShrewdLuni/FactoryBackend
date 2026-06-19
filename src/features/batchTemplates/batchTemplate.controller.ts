import { Controller } from "abstract/controller";
import { BatchTemplateItemInsertSchema, type BatchTemplateItem, type BatchTemplateItemInsert } from "./batchTemplate.schema";
import { BatchTemplateItemService } from "./batchTemplate.service";

export class BatchTemplateItemController extends Controller<BatchTemplateItem, BatchTemplateItemInsert, BatchTemplateItemService> {
  constructor(service: BatchTemplateItemService = new BatchTemplateItemService()) {
    super(service, BatchTemplateItemInsertSchema);
  }
}
