import { query } from "db"
import type { InsertAuthentication} from "schemas/authentication"

export const createAuthentication = async (data: InsertAuthentication): Promise<InsertAuthentication> => {
  const result = await query(`INSERT INTO authentication (employee_id, hash, salt) VALUES($1, $2, $3) RETURNING *`, [data.userId, data.hash, data.salt]);
  return result.rows[0];
}

export const updateAuthentication = async (id: number, update: Partial<InsertAuthentication>): Promise<InsertAuthentication> => {
  const result = await query(`UPDATE authentication SET hash = $2, salt = $3 WHERE employee_id = $1 RETURNING *`, [id, update.hash, update.salt])
  return result.rows[0];
}
