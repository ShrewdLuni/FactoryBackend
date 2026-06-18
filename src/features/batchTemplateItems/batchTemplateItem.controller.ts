import { Controller } from "abstract/controller";
import { BatchTemplateItemInsertSchema, type BatchTemplateItem, type BatchTemplateItemInsert } from "./batchTemplateItem.schema";
import { BatchTemplateItemService } from "./batchTemplateItem.service";

export class BatchTemplateItemController extends Controller<BatchTemplateItem, BatchTemplateItemInsert, BatchTemplateItemService> {
  constructor(service: BatchTemplateItemService = new BatchTemplateItemService()) {
    super(service, BatchTemplateItemInsertSchema);
  }
}
