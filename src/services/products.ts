import { query } from "db"
import type { DatabaseProduct, InsertProduct, Product } from "schemas/products"

export const createProduct = async (data: InsertProduct): Promise<DatabaseProduct> => {
  const result = await query("INSERT INTO products (code, category, name, measure_unit, is_active) VALUES($1, $2, $3, $4, $5) SELECTING *", [data.code, data.category, data.name, data.measureUnit, data.isActive])
  return result.rows[0];
}

export const updateProduct = async (id: number, data: InsertProduct): Promise<DatabaseProduct> => {
  const result = await query("UPDATE products SET code = $2, category = $3, name = $4, measure_unit = $5, is_active = $6 WHERE id = $1 RETURNING *", [id, data.code, data.category, data.name, data.measureUnit, data.isActive])
  return result.rows[0];
}

export const deleteProduct = async () => {

}

export const getProduct = async () => {

}

export const getProducts = async (): Promise<DatabaseProduct[]> => {
  const result = await query("SELECT * FROM products")
  return result.rows;
}
