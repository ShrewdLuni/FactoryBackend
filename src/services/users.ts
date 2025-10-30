import { query } from "db"
import { buildSetClause, buildWhereClause } from "utils/models/clauseBuilders"
import type { User, InsertUser } from "schemas/users"
import type { Authentication } from "schemas/authentication"

export const createUser = async (data: InsertUser): Promise<User> => {
  const result = await query(`
    INSERT INTO users (
    code,
    username,
    first_name,
    last_name,
    patronymic,
    date_of_birth,
    email,
    phone,
    gender,
    department) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
  [   data.code ?? null, 
      data.username ?? null, 
      data.firstName, 
      data.lastName, 
      data.patronymic ?? null, 
      data.dateOfBirth ?? null, 
      data.email, 
      data.phone ?? null, 
      data.gender ?? null, 
      data.department ?? null])

  if (!result.rows.length) {
    throw new Error("User already exists");
  }

  return result.rows[0];
}

export const getUsers = async(): Promise<User[]> => { 
  const result = await query("SELECT * FROM users");
  return result.rows;
}

export const getUserById = async (id: number): Promise<User> => {
  const result = await query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id])
  return result.rows[0];
}

export const getUserByCode = async (code: number): Promise<User> => {
  const result = await query(`SELECT * FROM users WHERE code = $1 LIMIT 1`, [code])
  return result.rows[0];
}

export const getUserByUsername = async (username: string): Promise<User> => {
  const result = await query(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username])
  return result.rows[0];
}

export const getUserWithAuthByCode = async (code: number): Promise<User & Authentication> => {
  const result = await query((`SELECT u.*, a.hash, a.salt FROM users u JOIN authentication a on a.employee_id = u.id WHERE u.code = $1 LIMIT 1`), [code])
  return result.rows[0];
}

export const getUserWithAuthByUsername = async (username: string): Promise<User & Authentication> => {
  const result = await query(`SELECT u.*, a.hash, a.salt FROM users u JOIN authentication a on a.employee_id = u.id WHERE u.username = $1 LIMIT 1`, [username])
  return result.rows[0];
}

// WIP 
export const getUser = async (identity: Partial<User>): Promise<User> => { 
  const where  = buildWhereClause(identity)

  const result = await query((`SELECT * FROM users ${where.clause} LIMIT 1`), where.values)
  return result.rows[0];
}

export const updateUser = async (identity: Partial<User>, update: Partial<User>): Promise<User> => {
  const set = buildSetClause(update)
  const where  = buildWhereClause(identity, set.values.length + 1)

  const result = await query((`
    UPDATE users 
    ${set.clause} 
    ${where.clause} 
    RETURNING *`), 
    [...set.values, ...where.values])
  return result.rows[0];
}

export const deleteUser = async (identity: Partial<User>): Promise<any> => { 
  const where  = buildWhereClause(identity)

  const result = await query((`DELETE FROM users ${where.clause} RETURNING *`), where.values)
  return result.rows[0];
}
