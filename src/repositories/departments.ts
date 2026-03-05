import { query } from "db";
import { type Department, DepartmentFromRow, type DepartmentInsert, type DepartmentRow } from "schemas/departments";
import { buildValuesPlaceholders } from "utils/queries/bulkInsert";

export class DepartmentRepository {
  async findMany(): Promise<Department[]> {
    const result = await query<DepartmentRow>(`SELECT * FROM departments`);
    const rows = result.rows;
    return DepartmentFromRow.array().parse(rows);
  }

  async find(id: number): Promise<Department> {
    const result = await query<DepartmentRow>(`SELECT * FROM departments WHERE id = $1 LIMIT 1`, [id]);
    const rows = result.rows;
    return DepartmentFromRow.parse(rows[0]);
  }
  
  async create(data: DepartmentInsert): Promise<Department> {
    const result = await query<DepartmentRow>(`INSERT INTO departments (label, is_active) VALUES($1, $2)`, [data.label, data.isActive]);
    const rows = result.rows;
    return DepartmentFromRow.parse(rows[0]);
  }

  async createMany(data: DepartmentInsert[]): Promise<Department[]> {
    const { placeholders, values } = buildValuesPlaceholders<DepartmentInsert>(data, item => [item.label, item.isActive])
    const result = await query<DepartmentRow>(`INSERT INTO departments (label, is_active) VALUES ${placeholders}`, values);
    const rows = result.rows;
    return DepartmentFromRow.array().parse(rows);
  }

  async update(id: number, data: DepartmentInsert): Promise<Department> {
    const result = await query<DepartmentRow>(`UPDATE departments SET label = $2, is_active = $3 WHERE id = $1 RETURNING *`, [id, data.label, data.isActive]);
    const rows = result.rows;
    return DepartmentFromRow.parse(rows[0]);
  }

  async delete(id: number): Promise<Department> {
    const result = await query<DepartmentRow>(`DELETE FROM departments WHERE id = $1 RETURNING *`, [id]);
    const rows = result.rows;
    return DepartmentFromRow.parse(rows[0]);
  }
}

