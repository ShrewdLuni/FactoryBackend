import { Repository } from "abstract/repository";
import {
  BatchTransitionFromRow,
  type BatchTransition,
  type BatchTransitionInsert,
  type BatchTransitionLookup,
  type BatchTransitionRow,
} from "./batchTransitions.schema";
import { query } from "db";
import { QUERY } from "./batchTransitions.query";

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
    coworkers: { column: "batch_id", extract: () => undefined },   
  });
}

}
