import { MeasureUnitFromRow, type MeasureUnit, type MeasureUnitInsert, type MeasureUnitRow } from "schemas/measureUnit";
import { query } from "db";

export class MeasureUnitRepository {
  async findMany(): Promise<MeasureUnit[]> {
    const result = await query<MeasureUnitRow>(`SELECT * FROM measure_units`);
    const rows = result.rows;
    return MeasureUnitFromRow.array().parse(rows);
  }

  async find(id: number): Promise<MeasureUnit> {
    const result = await query<MeasureUnitRow>(`SELECT * FROM measure_units WHERE id = $1 LIMIT 1`, [id]);
    const rows = result.rows;
    return MeasureUnitFromRow.parse(rows[0]);
  }
  
  async create(data: MeasureUnitInsert): Promise<MeasureUnit> {
    const result = await query<MeasureUnitRow>(`INSERT INTO measure_units (label, is_active) VALUES($1, $2)`, [data.label, data.isActive]);
    const rows = result.rows;
    return MeasureUnitFromRow.parse(rows[0]);
 }

  async update(id: number, data: MeasureUnitInsert): Promise<MeasureUnit> {
    const result = await query<MeasureUnitRow>(`UPDATE measure_units SET label = $2, is_active = $3 WHERE id = $1 RETURNING *`, [id, data.label, data.isActive]);
    const rows = result.rows;
    return MeasureUnitFromRow.parse(rows[0]);
  }

  async delete(id: number): Promise<MeasureUnit> {
    const result = await query<MeasureUnitRow>(`DELETE FROM measure_units WHERE id = $1 RETURNING *`, [id]);
    const rows = result.rows;
    return MeasureUnitFromRow.parse(rows[0]);
  }
}
