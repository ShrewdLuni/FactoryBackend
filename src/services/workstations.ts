import type { DatabaseWorkstation, InsertWorkstation } from "schemas/workstations"
import { query } from "../db"

export const getAllWorkstations = async (): Promise<DatabaseWorkstation[]> => {
  const result = await query("SELECT * FROM workstations")
  return result.rows
}

export const createWorkstation = async (data: InsertWorkstation): Promise<DatabaseWorkstation> => {
  const result = await query("INSERT INTO workstations (name, qr_code) VALUES($1, $2) RETURNING *", [data.name, data.qr_code])
  return result.rows[0];
}
