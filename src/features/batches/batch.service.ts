import { Service } from "abstract/service";
import { BatchRepository } from "./batch.repository";
import type { Batch, BatchInsert, BatchLookup } from "./batch.schema";

export class BatchService extends Service<Batch, BatchInsert, BatchLookup, BatchRepository> {
  constructor(repo: BatchRepository = new BatchRepository()) {
    super(repo)
  }
}
