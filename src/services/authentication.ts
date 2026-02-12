import { query } from "db"
import type { Authentication, DatabaseAuthentication, InsertAuthentication } from "schemas/authentication"

export const createAuthentication = async (data: InsertAuthentication): Promise<DatabaseAuthentication> => {
  const result = await query(`INSERT INTO authentication (user_id, hash, salt) VALUES($1, $2, $3) RETURNING *`, [data.userId, data.hash, data.salt]);
  return result.rows[0];
}

export const updateAuthentication = async (id: number, update: InsertAuthentication): Promise<DatabaseAuthentication> => {
  const result = await query(`UPDATE authentication SET hash = $2, salt = $3 WHERE user_id = $1 RETURNING *`, [id, update.hash, update.salt])
  return result.rows[0];
}

export const deleteAuthentication = async (id: number): Promise<Authentication> => {
  const result = await query("DELETE FROM authentication WHERE id = $1 RETURNING *", [id]);
  return result.rows[0]
}
