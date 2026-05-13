import { Service } from "abstract/service";
import { BatchStatusRepository } from "./batchStatus.repository";
import type { BatchStatus, BatchStatusInsert, BatchStatusLookup } from "./batchStatus.schema";

export class BatchStatusService extends Service<BatchStatus, BatchStatusInsert, BatchStatusLookup, BatchStatusRepository> {
  constructor(repo: BatchStatusRepository = new BatchStatusRepository()){
    super(repo)
  }
}
