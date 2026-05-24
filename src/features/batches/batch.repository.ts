import { Repository } from "abstract/repository";
import { BatchFromRow, type Batch, type BatchInsert, type BatchLookup, type BatchRow } from "./batch.schema";

export class BatchRepository extends Repository<Batch, BatchRow, BatchLookup, BatchInsert> {
  constructor() {
    super("batches", BatchFromRow, {
      name: "name",
      size: "size",
      product: { column: "product_id", extract: (d) => d.product.id },
      workstation: { column: "workstation_id", extract: (d) => d.workstation.id },
      status: { column: "status_id", extract: (d) => d.status.id },
      isActive: "is_active",
    });
  }
}
