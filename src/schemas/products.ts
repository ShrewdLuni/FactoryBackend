import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
  code: z.string(),
  name: z.string(),
};

const mapped = {
  measureUnitId: DbId,
  isActive: z.boolean().default(true),
};

export const ProductSchema = z.object({ ...shared, ...mapped });

export const DatabaseProductSchema = z.object({
  ...shared,
  measure_unit_id: mapped.measureUnitId,
  is_active: mapped.isActive,
});

export const ProductFromDatabase = DatabaseProductSchema.transform((db) => {
  const { is_active, measure_unit_id, ...rest } = db;
  return {
    ...rest,
    measureUnitId: db.measure_unit_id,
    isActive: db.is_active,
  };
});

export const DatabaseFromProduct = ProductSchema.transform((product) => {
  const { isActive, measureUnitId, ...rest } = product;
  return {
    ...rest,
    measure_unit_id: product.measureUnitId,
    is_active: product.isActive,
  };
});

export const InsertProductSchema = ProductSchema.omit({ id: true });

export const ProductsFromDatabase = ProductFromDatabase.array();
export const DatabaseFromProducts = DatabaseFromProduct.array();

export type Product = z.infer<typeof ProductSchema>;
export type DatabaseProduct = z.infer<typeof DatabaseProductSchema>;
export type InsertProduct = z.infer<typeof InsertProductSchema>;
