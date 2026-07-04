import { Repository } from "abstract/repository";
import { ShiftFromRow, type Shift, type ShiftInsert, type ShiftLookup, type ShiftRow } from "./shift.schema";
import { query } from "db";

export class ShiftRepository extends Repository<Shift, ShiftRow, ShiftLookup, ShiftInsert> {
  constructor() {
    super("worker_device_sessions", ShiftFromRow, 
      {
        worker: { column: "worker_id", extract: (d) => d.worker.id },
        device: { column: "device_id", extract: (d) => d.device.id },
      },
      {

        id: "id",
        worker: { column: "worker_id", extract: (v) => (v as { id: number }).id },
        device: { column: "device_id", extract: (v) => (v as { id: number }).id }
      }
    );
  }

  async findActiveByWorkerId(workerId: number, forUpdate = false): Promise<Shift | null> {
    const result = await query<ShiftRow>(
      `SELECT ws.*, d.name 
       FROM worker_device_sessions ws JOIN devices d ON ws.device_id = d.id
       WHERE ws.worker_id = $1 AND ws.ended_at IS NULL
       LIMIT 1
       ${forUpdate ? "FOR UPDATE" : ""}`,
      [workerId],
    );
    return result.rows[0] ? ShiftFromRow.parse(result.rows[0]) : null;
  }

  async endSession(workerId: number): Promise<Shift | null> {
    const result = await query<ShiftRow>(
      `UPDATE worker_device_sessions
       SET ended_at = now()
       WHERE worker_id = $1 AND ended_at IS NULL
       RETURNING *`,
      [workerId],
    );
    return result.rows[0] ? ShiftFromRow.parse(result.rows[0]) : null;
  }
}
