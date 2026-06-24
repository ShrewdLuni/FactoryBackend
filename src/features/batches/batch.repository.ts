import { Repository } from "abstract/repository";
import { BatchFromRow, type Batch, type BatchInsert, type BatchLookup, type BatchRow } from "./batch.schema";
import { query } from "db";

const FIND_ACTIVE_BY_WORKER_QUERY = `
SELECT b.*
FROM batches b
JOIN batch_statuses bs ON bs.id = b.status_id
JOIN LATERAL (
  SELECT bt.actor_id
  FROM batch_transitions bt
  WHERE bt.batch_id = b.id
  ORDER BY bt.occurred_at DESC
  LIMIT 1
) latest ON true
WHERE bs.is_in_progress = true
  AND latest.actor_id = $1;
`

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

  async findActiveByWorker(actorId: number): Promise<Batch[]> {
    const result = await query<BatchRow>(FIND_ACTIVE_BY_WORKER_QUERY, [actorId]);
    return BatchFromRow.array().parse(result.rows);
  }
}
