import { Repository } from "abstract/repository";
import { BatchFromRow, type Batch, type BatchInsert, type BatchLookup, type BatchRow } from "./batch.schema";
import { transaction } from "db";

export class BatchRepository extends Repository<Batch, BatchRow, BatchLookup, BatchInsert> {
  constructor() {
    super("batches", BatchFromRow, {
      name: "name",
      size: "size",
      product: { column: "product_id", extract: (d) => d.product ? d.product.id : null },
      workstation: { column: "workstation_id", extract: (d) => d.workstation ? d.workstation.id : null },
      status: { column: "status_id", extract: (d) => d.status ? d.status.id : 1 },
      isActive: "is_active",
    });
  }

  async advance() {
    return transaction(async (client) => {

    })
  }
}
