import { Service } from "abstract/service";
import { BatchTemplateRepository } from "./batchTemplate.repository";
import type { BatchTemplate, BatchTemplateInsert, BatchTemplateLookup } from "./batchTemplate.schema";

export class BatchTemplateService extends Service<BatchTemplate, BatchTemplateInsert, BatchTemplateLookup, BatchTemplateRepository> {
  constructor(repo: BatchTemplateRepository = new BatchTemplateRepository()) {
    super(repo)
  }
}
