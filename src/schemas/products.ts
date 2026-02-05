import { z } from "zod"
import { DbId } from "./utils";

export const ProductSchema = z.object({
  id: DbId, 
  code: z.string(),
  category: z.string().nullish(),
  name: z.string().nullish(),
  isActive: z.boolean().default(true),
  measureUnit: z.string().nullish().default("Pairs"),
});

export const DatabaseProductSchema = z.object({
  id: DbId,
  code: z.string(),
  category: z.string().nullish(),
  name: z.string().nullish(),
  is_active: z.boolean().default(true),
  measure_unit: z.string().nullish().default("Pairs"),
});

export const ProductFromDatabase = DatabaseProductSchema.transform((db) => ({
  id: db.id,
  code: db.code,
  category: db.category,
  name: db.name,
  isActive: db.is_active,
  measureUnit: db.measure_unit,
}))

export const DatabaseFromProduct = ProductSchema.transform((product) => ({
  id: product.id,
  code: product.code,
  category: product.category,
  name: product.name,
  is_active: product.isActive,
  measure_unit: product.measureUnit,
}))

export const InsertProductSchema = ProductSchema.omit({ id: true });

export const ProductsFromDatabase = ProductFromDatabase.array()
export const DatabaseFromProducts = DatabaseFromProduct.array()

export type Product = z.infer<typeof ProductSchema>;
export type DatabaseProduct = z.infer<typeof DatabaseProductSchema>;
export type InsertProduct = z.infer<typeof InsertProductSchema>;
