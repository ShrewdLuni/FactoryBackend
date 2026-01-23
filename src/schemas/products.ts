import { z } from "zod"

export const ProductSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  category: z.string().nullish(),
  name: z.string().nullish(),
  isActive: z.boolean().default(true),
  measureUnit: z.string().optional().nullable().default("Pairs"),
});

export const DatabaseProductSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  category: z.string().nullish(),
  name: z.string().nullish(),
  is_active: z.boolean().default(true),
  measure_unit: z.string().optional().nullable().default("Pairs"),
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

export const ExternalProductSchema = z.object({
  code: z.string(),
  name: z.string().transform((val) => (val.trim() === "" ? null : val)),
});

export const ProductFromExternalSchema = ExternalProductSchema.transform((product): InsertProduct => ({
  code: product.code,
  category: null,
  name: product.name,
  measureUnit: "Pairs",
  isActive: true
}));

export const ProductsFromExternalSchema = ExternalProductSchema.array();

export const InsertProductSchema = ProductSchema.omit({ id: true });

export const ProductsFromDatabase = ProductFromDatabase.array()
export const DatabaseFromProducts = DatabaseFromProduct.array()

export type Product = z.infer<typeof ProductSchema>;
export type DatabaseProduct = z.infer<typeof DatabaseProductSchema>;
export type ExternalProduct = z.infer<typeof ExternalProductSchema>;
export type InsertProduct = z.infer<typeof InsertProductSchema>;
