import { Service } from "abstract/service";
import { BatchTemplateItemRepository } from "./batchTemplateItem.repository";
import type { BatchTemplateItem, BatchTemplateItemInsert, BatchTemplateItemLookup } from "./batchTemplateItem.schema";

export class BatchTemplateItemService extends Service<BatchTemplateItem, BatchTemplateItemInsert, BatchTemplateItemLookup, BatchTemplateItemRepository> {
  constructor(repo: BatchTemplateItemRepository = new BatchTemplateItemRepository()) {
    super(repo)
  }
}
