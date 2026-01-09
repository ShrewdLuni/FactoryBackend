import type { DatabaseWorkstation, InsertWorkstation } from "schemas/workstations"
import { query } from "../db"

export const getAllWorkstations = async (): Promise<DatabaseWorkstation[]> => {
  const result = await query("SELECT * FROM workstations");
  return result.rows
}

export const getWorkstation = async (id: number): Promise<DatabaseWorkstation> => {
  const result = await query("SELECT * FROM workstations WHERE id = $1", [id]);
  return result.rows[0];
}

export const updateWorkstation = async (id: number, data: InsertWorkstation): Promise<DatabaseWorkstation> => {
  const result = await query("UPDATE workstations SET name = $2, qr_code = $3 WHERE id = $1 RETURNING *", [id, data.name, data.qr_code]);
  return result.rows[0];
}

export const deleteWorkstation = async (id: number): Promise<DatabaseWorkstation> => {
  const result = await query("DELETE FROM workstations WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}

export const createWorkstation = async (data: InsertWorkstation): Promise<DatabaseWorkstation> => {
  const result = await query("INSERT INTO workstations (name, qr_code) VALUES($1, $2) RETURNING *", [data.name, data.qr_code]);
  return result.rows[0];
}
