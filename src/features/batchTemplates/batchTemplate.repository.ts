import { Repository } from "abstract/repository";
import { BatchTemplateFromRow, type BatchTemplate, type BatchTemplateInsert, type BatchTemplateLookup, type BatchTemplateRow } from "./batchTemplate.schema";

export class BatchTemplateRepository extends Repository<BatchTemplate, BatchTemplateRow, BatchTemplateLookup, BatchTemplateInsert> {
  constructor() {
    super("batch_templates", BatchTemplateFromRow, {
      name: "name",
      description: "description",
      useCount: "use_count"
    });
  }
}
