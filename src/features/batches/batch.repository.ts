import { Repository } from "abstract/repository";
import { BatchFromRow, type Batch, type BatchInsert, type BatchLookup, type BatchRow } from "./batch.schema";
import { query } from "db";
import { FIND_ACTIVE_BY_WORKER_QUERY, FIND_ALL_BATCHES_QUERY } from "./batch.queries";
import type { FieldMap } from "abstract/types";

const fieldMap: FieldMap<BatchInsert> = {
  name: "name",
  size: "size",
  isActive: "is_active",
  product: { column: "product_id", extract: (d) => d.product?.id ?? null },
  workstation: { column: "workstation_id", extract: (d) => d.workstation?.id ?? null },
  status: { column: "status_id", extract: (d) => d.status?.id ?? null },
};

export class BatchRepository extends Repository<Batch, BatchRow, BatchLookup, BatchInsert> {
  constructor() {
    super("batches", BatchFromRow, fieldMap);
  }

  async findManyWithAll(): Promise<Batch[]> {
    const result = await query<BatchRow>(FIND_ALL_BATCHES_QUERY);
    return result.rows.map((row) => BatchFromRow.parse(row));
  }

  async findActiveByWorker(actorId: number): Promise<Batch[]> {
    const result = await query<BatchRow>(FIND_ACTIVE_BY_WORKER_QUERY, [actorId]);
    return BatchFromRow.array().parse(result.rows);
  }
}
