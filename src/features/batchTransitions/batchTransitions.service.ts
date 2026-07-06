import { Service } from "abstract/service";
import { BatchTransitionRepository } from "./batchTransitions.repository";
import type { BatchTransition, BatchTransitionInsert, BatchTransitionLookup } from "./batchTransitions.schema";

export class BatchTransitionService extends Service<BatchTransition, BatchTransitionInsert, BatchTransitionLookup, BatchTransitionRepository> {
  constructor(repo: BatchTransitionRepository = new BatchTransitionRepository()){
    super(repo)
  }
}
