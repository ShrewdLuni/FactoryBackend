import { query } from "db";
import { StatusTransitionFromRow, type StatusTransition, type StatusTransitionInsert, type StatusTransitionRow } from "schemas/statusTransitions";
import { buildValuesPlaceholders } from "utils/queries/bulkInsert";

export class StatusTransitionRepository {

  async find(id: number): Promise<StatusTransition> {
    const result = await query<StatusTransitionRow>(`SELECT * FROM status_transitions WHERE id = $1`, [id]);
    const rows = result.rows;
    return StatusTransitionFromRow.parse(rows)
  }

  async findMany(): Promise<StatusTransition[]> {
    const result = await query<StatusTransitionRow>(`SELECT * FROM status_transitions`);
    const rows = result.rows;
    return StatusTransitionFromRow.array().parse(rows)
  }

  async create(data: StatusTransitionInsert) {
    const result = await query<StatusTransitionRow>(`INSERT INTO status_transitions (from_status_id, to_status_id, required_department_id, required_role_id) VALUES($1, $2, $3, $4)`, [data.fromStatusId, data.toStatusId, data.requiredDepartmentId, data.requiredRoleId])
    const rows = result.rows;
    return StatusTransitionFromRow.parse(result)
  }

  async createMany(data: StatusTransitionInsert[]): Promise<StatusTransition[]> {
    const { placeholders, values } = buildValuesPlaceholders<StatusTransitionInsert>(data, item => [item.fromStatusId, item.toStatusId, item.requiredDepartmentId, item.requiredRoleId])
    const result = await query<StatusTransitionRow>(`INSERT INTO status_transitions (from_status_id, to_status_id, required_department_id, required_role_id) VALUES ${placeholders}`, values);
    const rows = result.rows;
    return StatusTransitionFromRow.array().parse(rows);
  }

  async delete(id: number): Promise<StatusTransition> {
    const result = await query<StatusTransitionRow>(`DELETE FROM status_transition WHERE id = $1 RETURNING *`, [id]);
    const rows = result.rows;
    return StatusTransitionFromRow.parse(rows[0]);
  }
}
