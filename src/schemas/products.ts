import { z } from "zod"
import { DbId } from "./utils";

const shared = {
  id: DbId, 
  code: z.string(),
  category: z.string().nullish(),
  name: z.string().nullish(),
}

const mapped = {
  isActive: z.boolean().default(true),
  measureUnit: z.string().nullish().default("Pairs"),
}

export const ProductSchema = z.object({...shared, ...mapped});

export const DatabaseProductSchema = z.object({
  ...shared,
  is_active: mapped.isActive,
  measure_unit: mapped.measureUnit,
});

export const ProductFromDatabase = DatabaseProductSchema.transform((db) => {
  const { is_active, measure_unit, ...rest} = db;
  return {
    ...rest,
    isActive: db.is_active,
    measureUnit: db.measure_unit,
  }
})

export const DatabaseFromProduct = ProductSchema.transform((product) => {
  const { isActive, measureUnit, ...rest} = product;
  return {
    ...rest,
    is_active: product.isActive,
    measure_unit: product.measureUnit,
  }
})

export const InsertProductSchema = ProductSchema.omit({ id: true });

export const ProductsFromDatabase = ProductFromDatabase.array()
export const DatabaseFromProducts = DatabaseFromProduct.array()

export type Product = z.infer<typeof ProductSchema>;
export type DatabaseProduct = z.infer<typeof DatabaseProductSchema>;
export type InsertProduct = z.infer<typeof InsertProductSchema>;
