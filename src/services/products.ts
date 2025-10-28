import { query } from "db"
import type { InsertProduct, Product } from "schemas/products"

export const createProduct = async (data: InsertProduct): Promise<Product> => {
  const result = await query("INSERT INTO products (code, category, name, measure_unit) VALUES($1, $2, $3, $4) SELECTING *", [data.code, data.category, data.name, data.measureUnit])
  return result.rows[0];
}

export const updateProduct = async () => {

}

export const deleteProduct = async () => {

}

export const getProduct = async () => {

}

export const getProducts = async (): Promise<Product[]> => {
  const result = await query("SELECT * FROM products")
  return result.rows;
}
