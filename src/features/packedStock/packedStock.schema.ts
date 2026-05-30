import { z } from "zod";
import { DbId } from "schemas/utils";
import { ProductSchema } from "features/products/product.schema";

const shared = {
  id: DbId,
  quantity: z.int().positive(),
};

const relations = {
  product: z.object({
    id: ProductSchema.shape.id,
    code: ProductSchema.shape.code.nullish(),
    name: ProductSchema.shape.name.nullish(),
  })
}

export const PackedStockSchema = z.object({ ...shared, ...relations }).meta({ id: "PackedStock" });

export const PackedStockRowSchema = z.object({
  ...shared,
  product_id: relations.product.shape.id,
  product_code: relations.product.shape.code.nullish(),
  product_name: relations.product.shape.name.nullish(),
});

export const PackedStockFromRow = PackedStockRowSchema.transform((row) => {
  const { product_id, product_code, product_name, ...rest } = row;
  return {
    ...rest,
    product: {
      id: product_id,
      code: product_code,
      name: product_name,
    }
  };
});

export const PackedStockInsertSchema = PackedStockSchema.omit({ id: true }).meta({ id:"PackedStockInsert" })

export const PackedStockLookupSchema = z.union([
  z.object({ id: z.number().positive() })
])

export type PackedStock = z.infer<typeof PackedStockSchema>;
export type PackedStockRow = z.infer<typeof PackedStockRowSchema>;
export type PackedStockInsert = z.infer<typeof PackedStockInsertSchema>;
export type PackedStockLookup = z.infer<typeof PackedStockLookupSchema>
