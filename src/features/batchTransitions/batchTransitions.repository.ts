import { Repository } from "abstract/repository";
import {
  BatchTransitionFromRow,
  type BatchTransition,
  type BatchTransitionInsert,
  type BatchTransitionLookup,
  type BatchTransitionRow,
} from "./batchTransitions.schema";
import { query } from "db";
import { FULL_SELECT } from "./batchTransitions.queries";

export class BatchTransitionRepository extends Repository<
  BatchTransition,
  BatchTransitionRow,
  BatchTransitionLookup,
  BatchTransitionInsert
> {
  constructor() {
    super("batch_transitions", BatchTransitionFromRow, {
      batch: { column: "batch_id", extract: (data) => data.batch.id },
      actor: { column: "actor_id", extract: (data) => data.actor.id },
      device: { column: "device_id", extract: (data) => data.device.id },
      fromStatus: { column: "from_status_id", extract: (data) => data.fromStatus.id },
      toStatus: { column: "to_status_id", extract: (data) => data.toStatus.id },
    });
  }

  async find(by: BatchTransitionLookup): Promise<BatchTransition | null> {
    const [key, value] = Object.entries(by)[0] ?? [];
    if (!key || value === undefined) throw new Error("Invalid lookup");
    if (key !== "id") throw new Error(`No lookup mapping for "${key}"`);

    const result = await query<BatchTransitionRow>(`${FULL_SELECT} WHERE bt.id = $1 LIMIT 1`, [value]);
    return result.rows[0] ? BatchTransitionFromRow.parse(result.rows[0]) : null;
  }

  async create(data: BatchTransitionInsert): Promise<BatchTransition> {
    const created = await query<{ id: number }>(
      `INSERT INTO batch_transitions (batch_id, batch_size, actor_id, device_id, from_status_id, to_status_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.batch.id, data.batch.size, data.actor.id, data.device.id, data.fromStatus.id, data.toStatus.id],
    );

    if (!created || !created.rows[0]) throw new Error("Failed to load created batch transition");

    const id = created.rows[0].id;

    if (data.coworkers?.length) {
      const values = data.coworkers.map((_, i) => `($1, $${i + 2})`).join(", ");
      await query(
        `INSERT INTO batch_transition_coworkers (transition_id, worker_id) VALUES ${values}`,
        [id, ...data.coworkers.map((c) => c.id)],
      );
    }
      return BatchTransitionFromRow.parse(created.rows[0]);
  }

}
