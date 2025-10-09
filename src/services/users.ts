import { query } from "db"
import type { User, InsertUser, UserWithAuth } from "models/users"
import { buildSetClause, buildWhereClause } from "utils/models/clauseBuilders"

export const createUser = async (data: InsertUser): Promise<User> => {
  const result = await query("INSERT INTO users (username, email) VALUES($1, $2) RETURNING id, username, email", [data.username, data.email])
  return result.rows[0];
}

export const getUser = async (identity: Partial<User>): Promise<User> => { 
  const where  = buildWhereClause(identity)

  const result = await query((`SELECT id, username, email FROM users ${where.clause} LIMIT 1`), where.values)
  return result.rows[0];
}

export const getUsers = async(): Promise<User[]> => { 
  const result = await query("SELECT id, username, email FROM users");
  return result.rows;
}

export const getUserWithAuth = async (identity: Partial<User>): Promise<UserWithAuth> => {
  const where  = buildWhereClause(identity)
  const result = await query((`SELECT * FROM users ${where.clause} LIMIT 1`), where.values)
  return result.rows[0];
}

export const updateUser = async (identity: Partial<User>, update: Partial<User>): Promise<User> => {
  const set = buildSetClause(update)
  const where  = buildWhereClause(identity, set.values.length + 1)

  const result = await query((`UPDATE users ${set.clause} ${where.clause} RETURNING id, username, email`), [...set.values, ...where.values])
  return result.rows[0];
}

export const deleteUser = async (identity: Partial<User>): Promise<any> => { 
  const where  = buildWhereClause(identity)

  const result = await query((`DELETE FROM users ${where.clause} RETURNING *`), where.values)
  return result.rows[0];
}
