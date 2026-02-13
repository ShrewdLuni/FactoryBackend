import { query } from "db"
import type { DatabaseProduct, InsertProduct } from "schemas/products"

export const getAllProducts = async (): Promise<DatabaseProduct[]> => {
  const result = await query("SELECT * FROM products")
  return result.rows;
}

export const getProduct = async (id: number): Promise<DatabaseProduct> => {
  const result = await query("SELECT * FROM products WHERE id = $1", [id])
  return result.rows[0];
}

export const createProduct = async (data: InsertProduct): Promise<DatabaseProduct> => {
  const result = await query("INSERT INTO products (code, category, name, measure_unit, is_active) VALUES($1, $2, $3, $4, $5) SELECTING *", [data.code, data.category, data.name, data.measureUnit, data.isActive])
  return result.rows[0];
}

export const updateProduct = async (id: number, data: InsertProduct): Promise<DatabaseProduct> => {
  const result = await query("UPDATE products SET code = $2, category = $3, name = $4, measure_unit = $5, is_active = $6 WHERE id = $1 RETURNING *", [id, data.code, data.category, data.name, data.measureUnit, data.isActive])
  return result.rows[0];
}

export const deleteProduct = async (id: number): Promise<DatabaseProduct> => {
  const result = await query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}

export const productsService = {
  getAll: getAllProducts,
  get: getProduct,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
}
